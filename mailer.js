require('dotenv').config('./.env')
const Address = require('./models/Address')
const Delivery = require('./models/Delivery')
const sequelize = require('./utils/db')
const { createTransport } = require('nodemailer')

if (process.argv.length != 3)
    process.exit()

const deliveryId = process.argv[2] * 1

const getNextAddress = async (delivery) => {
    console.log(`Поиск адреса для отправки сообщения...`);

    const query = `
        SELECT a.id, a.email
        FROM mailer.addresses as a
        JOIN mailer.addressGroups as ag ON a.id = ag.addressId
        JOIN mailer.groupDeliveries as gd ON gd.deliveryGroupId = ag.deliveryGroupId
        WHERE gd.deliveryId = ${delivery.id} AND a.id > ${delivery.lastAddressId}
        GROUP BY a.email
        ORDER BY a.id ASC
        LIMIT 0, 1`

    const [results, metadata] = await sequelize.query(query)

    if (results.length == 0) return null

    return { id: results[0].id, email: results[0].email }
}

const getAddressCount = async (delivery) => {
    const query = `SELECT SQL_CALC_FOUND_ROWS a.*
    FROM mailer.addresses as a
    JOIN mailer.addressGroups as ag ON a.id = ag.addressId
    JOIN mailer.groupDeliveries as gd ON gd.deliveryGroupId = ag.deliveryGroupId
    WHERE gd.deliveryId = ${delivery.id}
    GROUP BY a.email;`
    await sequelize.query(query)
    const queryCount = 'SELECT FOUND_ROWS() AS count;'
    const [count, _] = await sequelize.query(queryCount)

    if (count.length == 0) return 1

    return count[0].count
}

const updateDelivery = async (delivery, address) => {
    const addressesCount = await getAddressCount(delivery)
    delivery.lastAddressId = address.id
    delivery.sended = delivery.sended + 1
    delivery.progress = Math.ceil(delivery.sended * 100 / addressesCount)
    await delivery.save()
}

const mail = async(transporter, delivery, address) => {

    const html = delivery.template.html.replaceAll('[email]', address.email)

    const msg = {
        from: `${delivery.transport.sender} <${delivery.transport.username}>`,
        to: address.email,
        subject: delivery.subject,
        text: '',
        html: html
    }

    const info = await transporter.sendMail(msg)
    console.log(info);
}

console.log(`Ищу рассылку с Id = ${deliveryId}.`);

; (async () => {
    let delivery = await Delivery.scope('mailer').findByPk(deliveryId)
    if (!delivery) {
        console.log(`Рассылка с номером ${deliveryId} не найдена в базе.`);
        process.exit()
    }

    console.log(`Рассылка найдена (${delivery.subject}). Статус: ${Delivery.statusNames[delivery.status]}`);

    if (delivery.status != Delivery.statuses.LAUNCHED) {
        console.log('Рассылка не запущена. Завершение работы процесса.');
        process.exit()
    }

    const delay = process.env.DELAY || 3
    
    console.log('Запускаем цикл отправки сообщений');

    const transporter = createTransport({
        service: 'gmail',
        auth: {
            user: delivery.transport.username,
            pass: delivery.transport.password
        }
    })
    

    while (true) {
        delivery = await Delivery.scope('mailer').findByPk(deliveryId)

        if (delivery.status == Delivery.statuses.SUSPENDED) {
            console.log(`Обнаружен статус SUSPENDED. Процесс приостановлен.`);
            break
        }

        const address = await getNextAddress(delivery)

        if (!address) {
            console.log('Адресов для рассылки больше нет.');
            console.log('Помечаю рассылку завершенной...');
            delivery.status = Delivery.statuses.COMPLETED
            await delivery.save()
            console.log('Завершаю процесс.');
            break
        }

        console.log(`Адрес найден: ${address.email} (id = ${address.id})`);
        console.log('Отправляем сообщение...');

        // Отправка сообщения!
        mail(transporter, delivery, address)

        await updateDelivery(delivery, address)

        console.log(`Сообщение отправлено. Ожидание ${delay} сек.`);
        await new Promise(resolve => setTimeout(resolve, 1000 * delay));

        console.log('============= Повторяем цикл =============');
    }

    process.exit()

})()

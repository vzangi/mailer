const spawn = require('child_process').spawn;
const fs = require('fs')
const BaseController = require('./BaseController')
const Delivery = require('../models/Delivery');
const GroupDelivery = require('../models/GroupDelivery');

const startMailer = (deliveryId) => {
    const out = fs.openSync(`./logs/out_${deliveryId}.log`, 'a')
    const err = fs.openSync(`./logs/err_${deliveryId}.log`, 'a')

    spawn('node', ['mailer.js', deliveryId], {
        stdio: ['ignore', out, err],
        detached: true
    }).unref()
}

class DeliveryController extends BaseController {

    async addItem(req, res) {
        const {
            name,
            templateId,
            transportId,
            groups
        } = req.body

        try {
            const newItem = await Delivery.create({
                userId: req.user.id,
                templateId,
                transportId,
                name,
            })

            for (let group of groups)
                await GroupDelivery.create({
                    deliveryId: newItem.id,
                    ...group
                })

            res.json(await Delivery.findByPk(newItem.id))
        } catch (error) {
            console.log(error);
            res.status(400).json({ status: 0 })
        }

    }

    async run(req, res) {
        const { id } = req.params

        const delivery = await Delivery.findByPk(id)
        if (delivery.status == Delivery.statuses.LAUNCHED) {
            return res.status(400).json({ msg: 'Рассылка уже запущена' })
        }
        if (delivery.status == Delivery.statuses.COMPLETED) {
            return res.status(400).json({ msg: 'Рассылка завершена. Повторный запуск невозможен.' })
        }

        delivery.status = Delivery.statuses.LAUNCHED
        delivery.save()

        startMailer(id)

        res.json(delivery)
    }

    async pause(req, res) {
        const { id } = req.params

        const delivery = await Delivery.findByPk(id)

        if (delivery.status != Delivery.statuses.LAUNCHED) {
            return res.status(400).json({ msg: 'Рассылка не запущена. Невозможно её приостановить' })
        }

        delivery.status = Delivery.statuses.SUSPENDED
        delivery.save()

        res.json(delivery)
    }

    async stop(req, res) {
        const { id } = req.params

        const delivery = await Delivery.findByPk(id)

        if (delivery.status == Delivery.statuses.PENDING) {
            return res.status(400).json({ msg: 'Рассылка не запущена. Невозможно её остановить' })
        }
        if (delivery.status == Delivery.statuses.COMPLETED) {
            return res.status(400).json({ msg: 'Рассылка уже остановлена.' })
        }

        delivery.status = Delivery.statuses.COMPLETED
        delivery.save()

        res.json(delivery)
    }

    

    mailer(req, res) {

        const { id } = req.params


        const out = fs.openSync('./out.log', 'a')
        const err = fs.openSync('./err.log', 'a')

        spawn('node', ['mailer.js'], {
            stdio: ['ignore', out, err],
            detached: true
        }).unref()

        res.json({ ok: 1 })
    }

}

module.exports = new DeliveryController(Delivery, 'deliveries')

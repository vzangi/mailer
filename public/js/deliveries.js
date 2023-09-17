$(async function () {

    // Подгружаю список групп
    const groups = await $.get('/groups/all')
    $("#modalCheckboxTmpl").tmpl(groups).appendTo('#addItemForm .groups')

    // Подгружаю список шабонов
    const templates = await $.get('/templates/all')
    $("#optionTmpl").tmpl(templates).appendTo('#templateId')

    // Подгружаю список ящиков для отправки
    const transports = await $.get('/transports/all')
    $("#optionTmpl").tmpl(transports.map(t => {
        t.name = t.sender
        return t
    })).appendTo('#transportId')


    setInterval(() => {
        const runTasks = $(".statused.status-1")

        runTasks.each(async (i, task) => {
            const { id } = $(task).data()
            const item = await $.get(`/deliveries/item/${id}`)
            if (item.status != 1) {
                $(`tr[data-id=${id}]`).replaceWith($('#rowTmpl').tmpl(item))
            }
        })
    }, 5000)


    tableEditor('deliveries')

    $(".save-item").click(function () {
        data = {}
        data.name = ''//$("#name").val().trim()
        data.subject = $("#subject").val().trim()
        data.templateId = $("#templateId").val()
        data.transportId = $("#transportId").val()
        data.groups = []
        $("#addItemForm .form-check input").each((_, cbox) => {
            if (cbox.checked) data.groups.push({ deliveryGroupId: cbox.value })
        })
        if (data.groups.length == 0) {
            return alert("Неоходимо выбрать хотя бы одну группу")
        }
        if (data.subject == '') {
            return alert('Тема не указана')
        }
        $.post('/deliveries/add', data).done(item => {
            $("#rowTmpl").tmpl(item).prependTo($('tbody'))
        })
        $("#addItemForm").modal('hide')
        $("#addItemForm").find("input:not(.form-check-input)").val('')
    })


    $(".table-editor").on('click', '.play-delivery', function () {
        const { id } = $(this).data()
        $.get(`/deliveries/run/${id}`).done(delivery => {
            $(`tr[data-id=${id}]`).replaceWith($("#rowTmpl").tmpl(delivery))
        }).fail(err => {
            console.log(err)
        })
    })

    $(".table-editor").on('click', '.pause-delivery', function () {
        const { id } = $(this).data()
        $.get(`/deliveries/pause/${id}`).done(delivery => {
            $(`tr[data-id=${id}]`).replaceWith($("#rowTmpl").tmpl(delivery))
        }).fail(err => {
            console.log(err)
        })
    })

    $(".table-editor").on('click', '.stop-delivery', function () {
        const { id } = $(this).data()
        $.get(`/deliveries/stop/${id}`).done(delivery => {
            $(`tr[data-id=${id}]`).replaceWith($("#rowTmpl").tmpl(delivery))
        }).fail(err => {
            console.log(err)
        })
    })
})
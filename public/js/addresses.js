$(async function () {

    tableEditor('addresses', false)

    // Подгружаю список групп
    const groups = await $.get('/groups/all')

    // Вывожу их в модальные окна
    $("#modalCheckboxTmpl").tmpl(groups).appendTo('#addItemForm .groups')
    $("#modalCheckboxTmpl").tmpl(groups).appendTo('#selectGroupForm .groups')

    // Действие при нажатии на кнопку "Найти" - поиск адресов в базе
    $('#findAddressBtn').click(async function () {
        const address = $("#findAddress").val().trim()
        if (address == '') {
            $('tbody').empty()
            return false
        }

        const finded = await $.post('/addresses/find', { address })

        $("#rowTmpl").tmpl(finded).appendTo($('tbody').empty())
    })

    // Добавление новоо адреса в базу
    $(".save-item").click(function () {
        const email = $("#email").val().trim()
        const client = $("#client").val().trim()
        const checks = []
        $("#addItemForm .form-check input").each((i, cbox) => {
            if (cbox.checked) checks.push(cbox.value)
        })
        if (email != '') {
            $.post('/addresses/add', { email, client, checks }).done(address => {
                $("#rowTmpl").tmpl(address).prependTo($('tbody'))
                $("#addItemForm").modal('hide')
                $("#addItemForm").find("input:not(.form-check-input)").val('')
            })
        }
    })

    // Открытие окна редактирования групп адреса
    $(".table-editor").on('click', '.editGroupsBtn', function () {
        const { id, groups } = $(this).data()
        $("#selectAddressId").val(id)
        $("#selectGroupForm .form-check input").each((i, cbox) => {
            cbox.checked = false
        })
        groups.map(g => {
            $("#selectGroupForm #flexCheck_" + g.id)[0].checked = true
        })
        $("#selectGroupForm").modal('show')
    })

    // Сохранение отредактированного списка групп адреса
    $("#selectGroupForm .save-groups").click(async function () {
        const addressId = $("#selectAddressId").val().trim()
        const checks = []
        $("#selectGroupForm .form-check input").each((i, cbox) => {
            if (cbox.checked) checks.push(cbox.value)
        })

        const address = await $.post('/addresses/edit_groups', { addressId, checks })

        $(`tr[data-id=${addressId}]`).replaceWith( $("#rowTmpl").tmpl(address) )

        $("#selectGroupForm").modal('hide')
    })
})
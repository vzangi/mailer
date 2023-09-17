const tableEditor = async (route, loadAll = true) => {

    if (loadAll) {
        const items = await $.get(`/${route}/all`)
        $("#rowTmpl").tmpl(items).appendTo($('tbody'))
    }

    // Удаление элемента 
    $(".table-editor").on('click', '.remove-item', function () {
        const { id } = $(this).data()
        if (confirm("Удалить?")) {
            $.post(`/${route}/remove`, { id }).done(() => {
                $(`tr[data-id=${id}]`).remove()
            }).fail(err => {
                alert('Не удалось удалить запись. Возмоно на неё ссылаются другие сущности.')
            })
        }
    })

    // Сохраниение именённого поля
    $(".table-editor").on('click', '.save-btn', function () {
        const input = $(this).closest('.edited-box').find('input')
        const { id, field } = input.data()
        const value = input.val()
        $.post(`/${route}/edit`, { id, field, value })
        input.data().value = value
        input.removeClass('changed')
    })

    // Показывает или скрывает кнопку сохраниения поля
    $(".table-editor").on('keyup', '.edited-box input', function () {
        const nevValue = $(this).val()
        const { value } = $(this).data()
        if (value != nevValue) {
            $(this).addClass('changed')
        } else {
            $(this).removeClass('changed')
        }
    })

    // Вызов сохранения поля при нажатии на Enter
    $(".table-editor").on('keydown', '.edited-box input', function (event) {
        if (event.originalEvent.key == 'Enter') {
            if ($(this).hasClass('changed')) {
                $(this).next().find('.save-btn').click()
            }
        }
    })
}
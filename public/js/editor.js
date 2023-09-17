$(async function () {

    const templateId = $("#templateId").val()

    const template = await $.get(`/templates/${templateId}`)

    const editor = new FroalaEditor('textarea', {
        language: 'ru',
        imageInsertButtons: ['imageBack', '|', 'imageByURL']
    }, function () {
        editor.html.set(template.html)
    });


    $(".save-template").click(function () {
        const html = editor.html.get()
        $.post(`/templates/edit`, {
            id: templateId,
            field: 'html',
            value: html
        }).done(() => {
            alert('Шаблон сохранён')
        })
    })


})
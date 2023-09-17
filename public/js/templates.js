$(function () {

    tableEditor('templates')

    $(".save-item").click(function () {
        const name = $("#name").val().trim()
        if (name != '') {
            $.post('/templates/add', { name, html: '' }).done(item => {
                $("#rowTmpl").tmpl(item).prependTo($('tbody'))
            })
        }
        $("#addItemForm").modal('hide')
        $("#addItemForm").find("input").val('')
    })

})
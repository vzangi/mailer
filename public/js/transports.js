$(function () {

    tableEditor('transports')

    $(".save-item").click(function () {
        const sender = $("#sender").val().trim()
        const username = $("#username").val().trim()
        const password = $("#password").val().trim()
        if (username != '') {
            $.post('/transports/add', { sender, username, password }).done(item => {
                $("#rowTmpl").tmpl(item).appendTo($('tbody'))
            })
        }
        $("#addItemForm").modal('hide')
        $("#addItemForm").find("input").val('')
    })

})
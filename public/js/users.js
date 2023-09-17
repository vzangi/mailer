$(function () {

    tableEditor('users')

    $(".save-item").click(function () {
        const name = $("#name").val().trim()
        const login = $("#login").val().trim()
        const password = $("#password").val().trim()
        const role = $("#role").val()
        if (name != '') {
            $.post('/users/add', { name, login, password, role }).done(item => {
                $("#rowTmpl").tmpl(item).appendTo($('tbody'))
            })
        }
        $("#addItemForm").modal('hide')
        $("#addItemForm").find("input").val('')
    })

})
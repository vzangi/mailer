$(function () {
    const loginInput = $("input[name=login]")
    const passwordInput = $("input[name=password]")
    const form = $("form")
    const alert = $("form .alert")

    form.submit(function (event) {
        event.preventDefault()
        const login = loginInput.val()
        const password = passwordInput.val()
        console.log(login, password);

        $.ajax({
            method: 'POST',
            url: '/auth/login',
            data: {
                login,
                password
            },
            success: function () {
                location.href = '/'
            },
            error: function (err) {
                console.log(err.responseJSON);
                alert.text(err.responseJSON[0].msg).slideDown()
            }
        })


        return false
    })
})
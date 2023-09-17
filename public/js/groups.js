$(function () {

    tableEditor('groups')
    
    $(".save-item").click(function () {
        const name = $("#name").val().trim()
        if (name != '') {
            console.log(name);
            $.post('/groups/add', { name }).done(group => {
                $("#rowTmpl").tmpl(group).prependTo($('tbody'))
            })
        }
        $("#addItemForm").modal('hide')
        $("#addItemForm").find("input").val('')
    })

})
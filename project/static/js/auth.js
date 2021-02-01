$(document).ready(() => {
    $('#log-in-btn').on('click', (ev) => {
        ev.preventDefault();
        location.href = 'login';
    })

    $('#sign-up-btn').on('click', (ev) => {
        ev.preventDefault();
        location.href = 'signup';
    });

    $('#signup-submit').on('submit', (ev) => {
        ev.preventDefault();
        $('#error-container').empty();
        let error = '';
        let vals = [$('#signup-email').val(),$('#signup-email').val(),$('#signup-password-retype').val()];

        vals.forEach((x) => {if(x === '' && error === '') error='<h6>Invalid Password or Email</h6>'});

        if($('#signup-password-retype').val() !== $('#signup-password').val() && error === '') {
            error = '<h6>Passwords do not match</h6>';
        }

        if(error !== '') {
            $('#error-container').append(error);
        } else {
            $.ajax({
                url:'http://127.0.0.1:5000/signup',
                type:'POST',
                contentType: 'application/json;charset=utf-8',
                data:JSON.stringify({
                    'email':$('#signup-email').val(),
                    'password': $('#signup-password').val(),
                    'stay_signed_in': $('#signup-check').prop('checked')
                })
            }).then((res) => {
                if(res.status == 'error') {
                    $('#error-container').append(res.error_message);
                } else {
                    location.href = '/collections'
                }
            });
        }
    });

    $('#login-submit').on('submit', (ev) => {
        ev.preventDefault();
        $('#error-container').empty();
        if($('#login-check').prop('checked') === false) {
            window.sessionStorage.setItem('guest', true)
        }

        $.ajax({
            url: 'http://127.0.0.1:5000/login',
            type: 'POST',
            contentType:'application/json;charset=utf-8',
            data: JSON.stringify({
                'email':$('#login-email').val(),
                'password': $('#login-password').val(),
                'stay_signed_in': $('#login-check').prop('checked')
            })
        }).then((res) => {
            if(res.status == 'error') {
                $('#error-container').append(res.error_message);
            } else {
                location.href = '/collections'
            }
        });
    });

    $('#log-out').on('click', () => {
        $.ajax({
            url: 'http://127.0.0.1:5000/logout',
            type: 'GET',
            contentType:'application/json;charset=utf-8'
        }).then((res) => {
            if(res.status == 'success') {
                $('#modal').modal({backdrop: 'static', keyboard: false});
                $("#modal").modal('show');
                $('.modal-body').empty();
                $('.modal-body').append('<p>Signed Out</p>');
                $('.modal-body').append('<button class="btn" id="log-out-btn">Ok</button>')
            }
        });
    });
});
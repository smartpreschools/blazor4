var Login = (function () {
    $(document).ready(function () {
    });

    $('body').on('click', "#btnlogin", function () {
        var userName = $("#txtuserName").val();
        var password = $("#txtpassword").val();
        if (userName != "" && password != "") {
            login(userName, password);
        }
        else {
            if (userName == "") {
                $("#errtxtuserName").show();
                $("#errtxtuserName").html('Please enter username');
            }
            else {
                $("#errtxtuserName").hide();
            }
            if (password == "") {
                $("#errtxtpassword").show();
                $("#errtxtpassword").html('Please enter password');
            }
            else {
                $("#errtxtpassword").hide();
            }
        }
    });

    function login(userName, password) {

        var LoginSuccess = function (result) {
            if (result != "" || result.length > 0) {

            }
        }
        var data = {
            UserName : userName,
            Password : password
        };
        var url = '/Auth/Login/';
        CommonUtility.RequestAjax('POST', url, data, LoginSuccess, null, null, null);
    }

    return {
        login: login
    }
})();




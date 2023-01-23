var CustomerUI = (function () {
    var data = "";
    var optionSelect = "<option value='0' selected>Select value.. </option";
    $(document).ready(function () {
        BindDropdown("#ddlCategory", "Category", "", true);
    });
   
    //#region Add/Update Business Lead
    $('body').on('click', "#btnSubmit", function () {
        var categoryID = CommonUtility.ScriptInjection($("#ddlCategory").val()).replace(/</g, "").replace(/>/g, "");
        var name = CommonUtility.ScriptInjection($("#txtName").val()).replace(/</g, "").replace(/>/g, "");
        var mobile = CommonUtility.ScriptInjection($("#txtMobileNumber").val()).replace(/</g, "").replace(/>/g, "");
        var email = CommonUtility.ScriptInjection($("#txtEmail").val()).replace(/</g, "").replace(/>/g, "");
        var address = CommonUtility.ScriptInjection($("#txtAddress").val()).replace(/</g, "").replace(/>/g, "");
        var websiteName = CommonUtility.ScriptInjection($("#txtWebsiteName").val()).replace(/</g, "").replace(/>/g, "");
        var userName = CommonUtility.ScriptInjection($("#txtUserName").val()).replace(/</g, "").replace(/>/g, "");
        var password = CommonUtility.ScriptInjection($("#txtPassword").val()).replace(/</g, "").replace(/>/g, "");
        var desc = CommonUtility.ScriptInjection($("#txtDesc").val()).replace(/</g, "").replace(/>/g, "");


        //validation check
        var categorytatus = CommonValidation.MandetoryControlValueCheck("DROPDOWN", "ddlCategory");
        var namestatus = CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtName");
        var mobileStatus = CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtMobileNumber");
        var userNameStatus = CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtUserName");
        var passwordStatus = CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtPassword");
        var emailStatus = CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtEmail");
        var addressStatus = CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtAddress");

        data = {
            CategoryID: categoryID,
            FirstName: name,
            Mobile: mobile,
            Email: email,
            Address: address,
            WebsiteName: websiteName,
            Description: desc,
            UserName: userName,
            Password: password,
            Website: websiteName
        };

        if (categorytatus && namestatus && mobileStatus && userNameStatus && passwordStatus && emailStatus && addressStatus) {
            AddCustomer(data);
        }
    });

    function AddCustomer(data) {

        var AddCustomerSuccess = function (result) {
            if (result != "" || result.length > 0) {
                if (result === 2)
                    CommonUtility.SucessMessagePopUp("Thanks for registration Our Support team will be contact you shortly.");
                Clear();
            }
        }

        var url = '/Register/AddCustomer/';
        CommonUtility.RequestAjax('POST', url, data, AddCustomerSuccess, null, null, null);
    }

    //#endregion

    //#region Validation
    $('#txtName').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtName");
    });
    $('#txtMobileNumber').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtMobileNumber");
    });
    $('#txtUserName').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtUserName");
    });
    $('#txtPassword').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtPassword");
    });
    $('#txtEmail').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtEmail");
    });
    $('#txtAddress').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtAddress");
    });

    $('#ddlCategory').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("DROPDOWN", "ddlCategory");
    });


    //#endregion

    //#region clear Role controls
    $('body').on('click', "#btnClear", function () {
        Clear();
    });

    function Clear() {
        $("#txtName").val("");
        $("#txtMobileNumber").val("");
        $("#txtEmail").val("");
        $("#txtAddress").val("");
        $("#ddlCategory").val("0");
        $("#txtUserName").val("");
        $("#txtPassword").val("");
        $("#txtDesc").val("");
        $("#txtWebsiteName").val("");
        

        $("#errtxtUserName").html("").hide();
        $("#errtxtPassword").html("").hide();
        $("#errtxtName").html("").hide();
        $("#errtxtMobileNumber").html("").hide();
        $("#errtxtEmail").html("").hide();
        $("#errddlCategory").html("").hide();
        $("#errtxttxtAddress").html("").hide();
        
        
    }
    //#endregion

    //#region Bind DropDown  List
    function BindDropdown(contrlID, DrpName, inputValue, isAsync) {
        var BindDropDownData = function (result) {
            if (result != "" || result.length > 0) {
                $(contrlID + " option").remove();
                $.map(result, function (opt) {
                    var option = $('<option>' + opt.DataName + '</option>');
                    option.attr('value', opt.DataId);
                    $(contrlID).append(option);
                });
                $(contrlID + " option").remove("0");
                $(contrlID).prepend(optionSelect);
            }
        }
        var data = {
            dropName: DrpName,
            inputText: inputValue,
        };
        var url = '/ProductAdmin/Master/GetDropDownData/';
        if (isAsync)
            CommonUtility.RequestAjax('GET', url, data, BindDropDownData, null, null, null);
        else
            CommonUtility.RequestAjaxAsync('GET', url, data, BindDropDownData, null, null, null);

    }
    //#region Function return
    return {
        BindCustomerList: BindCustomerList,
        AddCustomer: AddCustomer,
        Clear: Clear,
        BindDropdown: BindDropdown
    }
    //#endregion

})();




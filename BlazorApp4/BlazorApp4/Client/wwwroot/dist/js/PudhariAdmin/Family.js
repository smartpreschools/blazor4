var Family = (function () {
    //#region Ready Function Start Point
    $(document).ready(function () {
        BindFamilyList();
    });
    //#endregion

    //#region Bind Category List
    function BindFamilyList() {
        var Success = function (result) {
            if (result != "" || result.length >= 0) {
                $('#familylist').DataTable({
                    data: result,
                    "bFilter": true,
                    "bLengthChange": true,
                    "bDestroy": true,
                    "lengthMenu": [[5, 10, 25, -1], [5, 10, 25, "All"]],
                    columns: [
                        { data: 'Name' },
                        { data: 'Relation' },
                        { data: 'Mobile' },
                        { data: 'Email' },
                        { data: 'WebsiteUrl' },

                        {
                            "data": "FamilyID",
                            "searchable": false,
                            "sortable": false,
                            "render": function (data, type, full, meta) {
                                return '<i class="fas fa-edit" id="editFamily" data-value ="' + data + '"></i>|<i class="fas fa-trash-alt" id="deleteFamily" data-value ="' + data + '" ></i>';
                            }
                        }
                    ]
                });
            }
        }

        var url = '/PudhariAdmin/Personal/GetFamilyList/';
        CommonUtility.RequestAjax('POST', url, "", Success, null, null, null);
    }
    //#endregion

    //#region Add New Category
    $('body').on('click', "#btnSubmit", function () {
        var name = CommonUtility.ScriptInjection($("#txtName").val()).replace(/</g, "").replace(/>/g, "");
        var relation = CommonUtility.ScriptInjection($("#txtRelation").val()).replace(/</g, "").replace(/>/g, "");
        var mobile = CommonUtility.ScriptInjection($("#txtMobile").val()).replace(/</g, "").replace(/>/g, "");
        var email = CommonUtility.ScriptInjection($("#txtEmail").val()).replace(/</g, "").replace(/>/g, "");
        var dob = CommonUtility.ScriptInjection($("#txtDOB").val()).replace(/</g, "").replace(/>/g, "");
        var websiteUrl = CommonUtility.ScriptInjection($("#txtWebsiteUrl").val()).replace(/</g, "").replace(/>/g, "");
        var desc = CommonUtility.ScriptInjection($("#txtDesc").val()).replace(/</g, "").replace(/>/g, "");
        var status = CommonUtility.ScriptInjection($("#ddlStatus").val()).replace(/</g, "").replace(/>/g, "");
        var familyID = CommonUtility.ScriptInjection($("#hdnFamilyID").val()).replace(/</g, "").replace(/>/g, "");

        var nameStatus = CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtName");

        if (nameStatus) {
            if (familyID != "")
                UpdateFamily(name, relation, mobile, email, dob, websiteUrl, desc, status, familyID)
            else
                AddFamily(name, relation, mobile, email, dob, websiteUrl, desc, status);
        }
    });

    function AddFamily(name, relation, mobile, email, dob, websiteUrl, desc, status) {
        var Success = function (result) {
            if (result != "" || result.length > 0) {
                Clear();
                BindFamilyList();
                if (result === 1)
                    CommonUtility.SucessMessagePopUp("Family details saved successfully.");
                if (result === -1)
                    CommonUtility.SucessMessagePopUp("Family details exists, could you try another name.");
            }
        }
        var data = {
            Name: name,
            Relation: relation,
            Mobile: mobile,
            Email: email,
            DOB: dob,
            WebsiteUrl: websiteUrl,
            Description: desc,
            Status: status
        };
        var url = '/PudhariAdmin/Personal/AddFamily/';
        CommonUtility.RequestAjax('POST', url, data, Success, null, null, null);
    }

    function UpdateFamily(name, relation, mobile, email, dob, websiteUrl, desc, status, familyID) {
        var Success = function (result) {
            if (result != "" || result.length > 0) {
                Clear();
                CommonUtility.SucessMessagePopUp("Political history updated successfully.");
                BindFamilyList();
            }
        }
        var data = {
            FamilyID: familyID,
            Name: name,
            Relation: relation,
            Mobile: mobile,
            Email: email,
            DOB: dob,
            WebsiteUrl: websiteUrl,
            Description: desc,
            Status: status
        };
        var url = '/PudhariAdmin/Personal/UpdateFamily/';
        CommonUtility.RequestAjax('POST', url, data, Success, null, null, null);
    }
    //#endregion

    //#region Validation
    $('#txtName').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtName");
    });
    $('#txtCollege').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtCollege");
    });
    $('#txtDegree').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtDegree");
    });


    //#endregion

    //#region clear PoliticalParty controls
    $('body').on('click', "#btnClear", function () {
        Clear();
    });

    function Clear() {
        $("#txtName").val("");
        $("#txtEmail").val("");
        $("#txtMobile").val("");
        $("#txtRelation").val("");
        $("#txtDOB").val("");
        $("#txtWebsiteUrl").val("");
        $("#txtDesc").val("");

        $("#hdnFamilyID").val("");

        $("#errtxtName").html("").hide();
    }
    //#endregion

    //#region delete Category
    $('body').on('click', "#deleteFamily", function () {
        var id = $(this).attr('data-value');
        CommonUtility.DeleteWarningMessagePopIp("Are you sure you want to delete family detail", id);
    });
    $('body').on('click', "#finaldelete", function () {
        var id = $(this).attr('data-myval')
        DeleteFamily(id);
    });
    function DeleteFamily(FamilyID) {
        var familyID = CommonUtility.ScriptInjection(FamilyID).replace(/</g, "").replace(/>/g, "");
        var Success = function (result) {
            if (result != "" || result.length > 0) {
                $("#modal-delete-danger").modal('hide');
                CommonUtility.SucessMessagePopUp("Family detail deleted successfully.");
                BindFamilyList();
                Clear();
            }
        }
        var data = {
            FamilyID: familyID
        };
        var url = '/PudhariAdmin/Personal/DeleteFamily/';
        CommonUtility.RequestAjax('POST', url, data, Success, null, null, null);
    }
    //#endregion

    //#region Edit Category
    $('body').on('click', "#editFamily", function () {
        var familyID = $(this).attr('data-value');
        var BindSuccess = function (result) {
            if (result != "" || result.length >= 0) {
                $("#txtName").val(result.Name);
                $("#txtRelation").val(result.Relation);
                $("#txtMobile").val(result.Mobile);
                $("#txtEmail").val(result.Email);
                $("#txtDOB").val(result.DOB);
                $("#txtWebsiteUrl").val(result.WebsiteUrl);
                $("#txtDesc").val(result.Description);
                $("#ddlStatus").val(result.Status);
                $("#hdnFamilyID").val(result.FamilyID);
            }
        }
        var data = {
            FamilyID: familyID
        };
        var url = '/PudhariAdmin/Personal/GetFamilyByID/';
        CommonUtility.RequestAjax('GET', url, data, BindSuccess, null, null, null);
    });
    //#endregion

    //#region Function return
    return {
        BindFamilyList: BindFamilyList,
        AddFamily: AddFamily,
        Clear: Clear,
        DeleteFamily: DeleteFamily
    }
    //#endregion

})();




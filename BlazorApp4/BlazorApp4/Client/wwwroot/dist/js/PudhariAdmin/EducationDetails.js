var Education = (function () {
    //#region Ready Function Start Point
    $(document).ready(function () {
        BindEducationList();
    });
    //#endregion

    //#region Bind Category List
    function BindEducationList() {
        var Success = function (result) {
            if (result != "" || result.length >= 0) {
                $('#educationlist').DataTable({
                    data: result,
                    "bFilter": true,
                    "bLengthChange": true,
                    "bDestroy": true,
                    "lengthMenu": [[5, 10, 25, -1], [5, 10, 25, "All"]],
                    columns: [
                        { data: 'University' },
                        { data: 'College' },
                        { data: 'Degree' },
                        { data: 'PassoutYear' },
                        { data: 'Percentage' },

                        {
                            "data": "EducationID",
                            "searchable": false,
                            "sortable": false,
                            "render": function (data, type, full, meta) {
                                return '<i class="fas fa-edit" id="editEducation" data-value ="' + data + '"></i>|<i class="fas fa-trash-alt" id="deleteEducation" data-value ="' + data + '" ></i>';
                            }
                        }
                    ]
                });
            }
        }

        var url = '/PudhariAdmin/Personal/GetEducationList/';
        CommonUtility.RequestAjax('POST', url, "", Success, null, null, null);
    }
    //#endregion

    //#region Add New Category
    $('body').on('click', "#btnSubmit", function () {
        var university = CommonUtility.ScriptInjection($("#txtUniversity").val()).replace(/</g, "").replace(/>/g, "");
        var college = CommonUtility.ScriptInjection($("#txtCollege").val()).replace(/</g, "").replace(/>/g, "");
        var degree = CommonUtility.ScriptInjection($("#txtDegree").val()).replace(/</g, "").replace(/>/g, "");
        var percentage = CommonUtility.ScriptInjection($("#txtPercentage").val()).replace(/</g, "").replace(/>/g, "");
        var passoutYear = CommonUtility.ScriptInjection($("#txtPassoutYear").val()).replace(/</g, "").replace(/>/g, "");
        var desc = CommonUtility.ScriptInjection($("#txtDesc").val()).replace(/</g, "").replace(/>/g, "");
        var status = CommonUtility.ScriptInjection($("#ddlStatus").val()).replace(/</g, "").replace(/>/g, "");
        var educationID = CommonUtility.ScriptInjection($("#hdnEducationID").val()).replace(/</g, "").replace(/>/g, "");

        var universityStatus = CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtUniversity");
        var collegeStatus = CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtCollege");
        var degreeStatus = CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtDegree");



        if (universityStatus && collegeStatus && degreeStatus) {
            if (educationID != "")
                UpdateEducation(university, college, degree, percentage, passoutYear, desc, status, educationID)
            else
                AddEducation(university, college, degree, percentage, passoutYear, desc, status);
        }
    });

    function AddEducation(university, college, degree, percentage, passoutYear, desc, status) {
        var Success = function (result) {
            if (result != "" || result.length > 0) {
                Clear();
                BindEducationList();
                if (result === 1)
                    CommonUtility.SucessMessagePopUp("Education details saved successfully.");
                if (result === -1)
                    CommonUtility.SucessMessagePopUp("Education details exists, could you try another name.");
            }
        }
        var data = {
            University: university,
            College: college,
            Degree: degree,
            Percentage: percentage,
            PassoutYear: passoutYear,
            Description: desc,
            Status: status
        };
        var url = '/PudhariAdmin/Personal/AddEducation/';
        CommonUtility.RequestAjax('POST', url, data, Success, null, null, null);
    }

    function UpdateEducation(university, college, degree, percentage, passoutYear, desc, status,educationID) {
        var Success = function (result) {
            if (result != "" || result.length > 0) {
                Clear();
                CommonUtility.SucessMessagePopUp("Political history updated successfully.");
                BindEducationList();
            }
        }
        var data = {
            EducationID: educationID,
            University: university,
            College: college,
            Degree: degree,
            Percentage: percentage,
            PassoutYear: passoutYear,
            Description: desc,
            Status: status
        };
        var url = '/PudhariAdmin/Personal/UpdateEducation/';
        CommonUtility.RequestAjax('POST', url, data, Success, null, null, null);
    }
    //#endregion

    //#region Validation
    $('#txtUniversity').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtUniversity");
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
        $("#txtUniversity").val("");
        $("#txtCollege").val("");
        $("#txtDegree").val("");
        $("#txtPercentage").val("");
        $("#txtPassoutYear").val("");
        $("#txtDesc").val("");

        $("#hdnEducationID").val("");


        $("#errtxtUniversity").html("").hide();
        $("#errtxtCollege").html("").hide();
        $("#errtxtDegree").html("").hide();
    }
    //#endregion

    //#region delete Category
    $('body').on('click', "#deleteEducation", function () {
        var id = $(this).attr('data-value');
        CommonUtility.DeleteWarningMessagePopIp("Are you sure you want to delete education detail", id);
    });
    $('body').on('click', "#finaldelete", function () {
        var id = $(this).attr('data-myval')
        DeleteEducation(id);
    });
    function DeleteEducation(EducationID) {
        var educationID = CommonUtility.ScriptInjection(EducationID).replace(/</g, "").replace(/>/g, "");
        var Success = function (result) {
            if (result != "" || result.length > 0) {
                $("#modal-delete-danger").modal('hide');
                CommonUtility.SucessMessagePopUp("Education detail deleted successfully.");
                BindEducationList();
                Clear();
            }
        }
        var data = {
            EducationID: educationID
        };
        var url = '/PudhariAdmin/Personal/DeleteEducation/';
        CommonUtility.RequestAjax('POST', url, data, Success, null, null, null);
    }
    //#endregion

    //#region Edit Category
    $('body').on('click', "#editEducation", function () {
        var educationID = $(this).attr('data-value');
        var BindSuccess = function (result) {
            if (result != "" || result.length >= 0) {
                $("#txtUniversity").val(result.University);
                $("#txtCollege").val(result.College);
                $("#txtDegree").val(result.Degree);
                $("#txtPercentage").val(result.Percentage);
                $("#txtPassoutYear").val(result.PassoutYear);
                $("#txtDesc").val(result.Description);
                $("#ddlStatus").val(result.Status);
                $("#hdnEducationID").val(result.EducationID);
            }
        }
        var data = {
            EducationID: educationID
        };
        var url = '/PudhariAdmin/Personal/GetEducationByID/';
        CommonUtility.RequestAjax('GET', url, data, BindSuccess, null, null, null);
    });
    //#endregion

    //#region Function return
    return {
        BindEducationList: BindEducationList,
        AddEducation: AddEducation,
        Clear: Clear,
        DeleteEducation: DeleteEducation
    }
    //#endregion

})();




var PostJob = (function () {

    //#region Ready Function Start Point
    $(document).ready(function () {
        BindDropdown("#ddlCategory", "Category", "", true);
        BindDropdown("#ddlValidity", "PlanValidity", "", true);
        BindPostJobList();
    });
    //#endregion
    var optionSelect = "<option value='0' selected>Select value.. </option";
    //#region Bind Country List
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
    //#endregion
    //#region Bind State List
    function BindPostJobList() {
        var Success = function (result) {
            if (result != "" || result.length >= 0) {
                $('#postjoblist').DataTable({
                    data: result,
                    "bFilter": true,
                    "bLengthChange": true,
                    "bDestroy": true,
                    "lengthMenu": [[5, 10, 25, -1], [5, 10, 25, "All"]],
                    columns: [
                        { data: 'Category' },
                        { data: 'JobTitle' },
                        { data: 'Location' },
                        { data: 'Qualification' },
                        { data: 'Experience' },
                        { data: 'Payment' },
                        {
                            data: "Status",
                            render: function (data, type, row) {
                                if (data === "True") { return "Active" }
                                else return "InActive"
                            }
                        },
                        {
                            "data": "PlanID",
                            "searchable": false,
                            "sortable": false,
                            "render": function (data, type, full, meta) {
                                return '<i class="fas fa-edit" id="editPostJob" data-value ="' + data + '"></i>|<i class="fas fa-trash-alt" id="deletePostJob" data-value ="' + data + '" ></i>';
                            }
                        }
                    ]
                });
            }
        }

        var url = '/ProductAdmin/WebAdmin/GetPostJobList/';
        CommonUtility.RequestAjax('POST', url, "", Success, null, null, null);
    }
    //#endregion

    //#region Add New State
    $('body').on('click', "#btnSubmit", function () {
        var category = CommonUtility.ScriptInjection($("#ddlCategory").val()).replace(/</g, "").replace(/>/g, "");
        var jobtitle = CommonUtility.ScriptInjection($("#txtJobTitle").val()).replace(/</g, "").replace(/>/g, "");
        var location = CommonUtility.ScriptInjection($("#txtJobLocation").val()).replace(/</g, "").replace(/>/g, "");
        var qualification = CommonUtility.ScriptInjection($("#txtJobQualification").val()).replace(/</g, "").replace(/>/g, "");
        var experience = CommonUtility.ScriptInjection($("#txtExperience").val()).replace(/</g, "").replace(/>/g, "");
        var payment = CommonUtility.ScriptInjection($("#txtPayment").val()).replace(/</g, "").replace(/>/g, "");
        var jobStatus = CommonUtility.ScriptInjection($("#ddlStatus").val()).replace(/</g, "").replace(/>/g, "");
        var desc = CommonUtility.ScriptInjection($("#txtJobDesc").val()).replace(/</g, "").replace(/>/g, "");
        var jobID = CommonUtility.ScriptInjection($("#hdnJobID").val()).replace(/</g, "").replace(/>/g, "");

        var categoryStatus = CommonValidation.MandetoryControlValueCheck("DROPDOWN", "ddlCategory");
        var jobtitleStatus = CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtJobTitle");
        var locationStatus = CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtJobLocation");
        var qualificationStatus = CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtJobQualification");
        var experienceStatus = CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtExperience");
        var paymentStatus = CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtPayment");


        if (categoryStatus && jobtitleStatus && locationStatus && qualificationStatus && experienceStatus && paymentStatus) {
            if (jobID != "")
                UpdateJob(jobID, category, jobtitle , location, qualification, experience, payment, jobStatus, desc)
            else
                AddJob(category, jobtitle , location, qualification, experience, payment, jobStatus, desc);
        }
    });

    function AddJob(category, jobtitle, location, qualification, experience, payment, jobStatus, desc) {

        var Success = function (result) {
            if (result != "" || result.length > 0) {
                Clear();
                BindPostJobList();
                if (result === 1)
                    CommonUtility.SucessMessagePopUp("Job saved successfully.");
                if (result === -1)
                    CommonUtility.SucessMessagePopUp("Job already exists, could you try another name.");
            }
        }
        var data = {
            Category: category,
            JobTitle: jobtitle,
            Location: location,
            Qualification: qualification,
            Experience: experience,
            Payment: payment,
            Status: jobStatus,
            PlanDesc: desc
        };
        var url = '/ProductAdmin/WebAdmin/AddPostJob/';
        CommonUtility.RequestAjax('POST', url, data, Success, null, null, null);
    }

    function UpdateJob(jobID, category, jobtitle, location, qualification, experience, payment, jobStatus, desc) {

        var Success = function (result) {
            if (result != "" || result.length > 0) {
                CommonUtility.SucessMessagePopUp("Post Job updated successfully.");
                Clear();
                BindPostJobList();
            }
        }
        var data = {
            JobID: jobID,
            Category: category,
            JobTitle: jobtitle,
            Location: location,
            Qualification: qualification,
            Experience: experience,
            Payment: payment,
            Status: jobStatus,
            PlanDesc: desc
        };
        var url = '/ProductAdmin/WebAdmin/UpdatePostJob/';
        CommonUtility.RequestAjax('POST', url, data, Success, null, null, null);
    }
    //#endregion

    //#region Validation
    $('#ddlCategory').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("DROPDOWN", "ddlCategory")
    });
    $('#txtJobTitle').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtJobTitle");
    });

    $('#txtJobLocation').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtJobLocation");
    });

    $('#txtJobQualification').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtJobQualification");
    });
    $('#txtExperience').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtExperience")
    });
    $('#txtPayment').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtPayment");
    });
    //#region Validation


    //#endregion

    //#region clear State controls
    $('body').on('click', "#btnClear", function () {
        Clear();
    });

    function Clear() {

        $("#ddlCategory").val("0");
        $("#txtJobTitle").val("");
        $("#txtJobLocation").val("");
        $("#txtJobQualification").val("");
        $("#txtExperience").val("");
        $("#txtPayment").val("");
        $("#hdnJobID").val("");
        $("#txtJobDesc").val("");

        $("#errtxtJobTitle").html("").hide();
        $("#errddlCategory").html("").hide();
        $("#errtxtJobLocation").html("").hide();
        $("#errtxtJobQualification").html("").hide();
        $("#errtxtExperience").html("").hide();
        $("#errtxtPayment").html("").hide();
    }
    //#endregion

    //#region delete Category
    $('body').on('click', "#deletePostJob", function () {
        var id = $(this).attr('data-value');
        CommonUtility.DeleteWarningMessagePopIp("Are you sure you want to delete Job", id);
    });
    $('body').on('click', "#finaldelete", function () {
        var id = $(this).attr('data-myval')
        DeleteJob(id);
    });
    function DeleteJob(JobID) {
        var jobID = CommonUtility.ScriptInjection(JobID).replace(/</g, "").replace(/>/g, "");
        var Success = function (result) {
            if (result != "" || result.length > 0) {
                $("#modal-delete-danger").modal('hide');
                CommonUtility.SucessMessagePopUp("Job Deleted successfully.");
                BindPostJobList();
                Clear();
            }
        }
        var data = {
            JobID: jobID
        };
        var url = '/ProductAdmin/WwbAdmin/DeletePostJob/';
        CommonUtility.RequestAjax('POST', url, data, Success, null, null, null);
    }
    //#endregion

    //#region Edit Category
    $('body').on('click', "#editPostJob", function () {
        var jobID = $(this).attr('data-value');
        var Sucess = function (result) {
            if (result != "" || result.length >= 0) {
                $("#ddlCategory").val(result.Category);
                $("#txtJobTitle").val(result.JobTitle);
                $("#txtJobLocation").val(result.JobLocation);
                $("#txtJobQualification").val(result.JobQualification);
                $("#txtExperience").val(result.Experience);
                $("#txtPayment").val(result.Payment);
                $("#txtJobDesc").val(result.JobDesc);
                $("#ddlStatus").val(result.Status);
                $("#hdnJobID").val(result.JobID);
            }
        }
        var data = {
            JobID: jobID
        };
        var url = '/ProductAdmin/WebAdmin/GetPostJobByID/';
        CommonUtility.RequestAjax('GET', url, data, Sucess, null, null, null);
    });
    //#endregion

    //#region Function return
    return {
        BindPostJobList: BindPostJobList,
        AddJob: AddJob,
        Clear: Clear,
        DeleteData: DeleteData,
        DeleteJob: DeleteJob
    }
    //#endregion

})();
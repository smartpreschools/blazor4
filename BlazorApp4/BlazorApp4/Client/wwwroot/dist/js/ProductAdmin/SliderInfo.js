var SliderInfo = (function () {

    //#region Ready Function Start Point
    $(document).ready(function () {
        BindDropdown("#ddlCategory", "Category", "", true);
       // BindDropdown("#ddlValidity", "PlanValidity", "", true);
        BindSliderInfoList();
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
    function BindSliderInfoList() {
        var Success = function (result) {
            if (result != "" || result.length >= 0) {
                $('#sliderinfolist').DataTable({
                    data: result,
                    "bFilter": true,
                    "bLengthChange": true,
                    "bDestroy": true,
                    "lengthMenu": [[5, 10, 25, -1], [5, 10, 25, "All"]],
                    columns: [
                        { data: 'Category' },
                        { data: 'HeadingName' },
                        { data: 'SlogenName' },
                        { data: 'MarqueeName' },
                        { data: 'FooterText' },
                        { data: 'PageTitle' },
                        {
                            data: "Status",
                            render: function (data, type, row) {
                                if (data === "True") { return "Active" }
                                else return "InActive"
                            }
                        },
                        {
                            "data": "InfoID",
                            "searchable": false,
                            "sortable": false,
                            "render": function (data, type, full, meta) {
                                return '<i class="fas fa-edit" id="editSliderInfo" data-value ="' + data + '"></i>|<i class="fas fa-trash-alt" id="deleteSliderInfo" data-value ="' + data + '" ></i>';
                            }
                        }
                    ]
                });
            }
        }

        var url = '/ProductAdmin/WebAdmin/GetSliderInfoList/';
        CommonUtility.RequestAjax('POST', url, "", Success, null, null, null);
    }
    //#endregion

    //#region Add New State
    $('body').on('click', "#btnSubmit", function () {
        var category = CommonUtility.ScriptInjection($("#ddlCategory").val()).replace(/</g, "").replace(/>/g, "");
        var headingName = CommonUtility.ScriptInjection($("#txtHeadingName").val()).replace(/</g, "").replace(/>/g, "");
        var slogenName = CommonUtility.ScriptInjection($("#txtSlogenName").val()).replace(/</g, "").replace(/>/g, "");
        var marqueeName = CommonUtility.ScriptInjection($("#txtMarqueeName").val()).replace(/</g, "").replace(/>/g, "");
        var footerText = CommonUtility.ScriptInjection($("#txtFooterText").val()).replace(/</g, "").replace(/>/g, "");
        var pageTitle = CommonUtility.ScriptInjection($("#txtPageTitle").val()).replace(/</g, "").replace(/>/g, "");
        var infoStatus = CommonUtility.ScriptInjection($("#ddlStatus").val()).replace(/</g, "").replace(/>/g, "");
        var desc = CommonUtility.ScriptInjection($("#txtSliderInfoDesc").val()).replace(/</g, "").replace(/>/g, "");
        var infoID = CommonUtility.ScriptInjection($("#hdnInfoID").val()).replace(/</g, "").replace(/>/g, "");

        var categoryStatus = CommonValidation.MandetoryControlValueCheck("DROPDOWN", "ddlCategory");
        var headingNameStatus = CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtHeadingName");
        var slogenNameStatus = CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtSlogenName");
        var marqueeNameStatus = CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtMarqueeName");
        var footerTextStatus = CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtFooterText");
        var pageTitleStatus = CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtPageTitle");


        if (categoryStatus && headingNameStatus && slogenNameStatus && marqueeNameStatus && footerTextStatus && pageTitleStatus) {
            if (infoID != "")
                UpdateInfo(infoID, category, headingName, slogenName, marqueeName, footerText, pageTitle, infoStatus, desc)
            else
                AddInfo(category, headingName, slogenName, marqueeName, footerText, pageTitle, infoStatus, desc);
        }
    });

    function AddInfo(category, headingName, slogenName, marqueeName, footerText, pageTitle, infoStatus, desc) {

        var Success = function (result) {
            if (result != "" || result.length > 0) {
                Clear();
                BindSliderInfoList();
                if (result === 1)
                    CommonUtility.SucessMessagePopUp("Slider Info saved successfully.");
                if (result === -1)
                    CommonUtility.SucessMessagePopUp("info already exists, could you try another name.");
            }
        }
        var data = {
            Category: category,
            HeadingName: headingName,
            SlogenName: slogenName,
            MarqueeName: marqueeName,
            FooterText: footerText,
            PageTitle: pageTitle,
            Status: infoStatus,
            InfoDesc: desc
        };
        var url = '/ProductAdmin/WebAdmin/AddSliderInfo/';
        CommonUtility.RequestAjax('POST', url, data, Success, null, null, null);
    }

    function UpdateInfo(infoID, category, headingName, slogenName, marqueeName, footerText, pageTitle, infoStatus, desc) {

        var Success = function (result) {
            if (result != "" || result.length > 0) {
                CommonUtility.SucessMessagePopUp("Slider updated successfully.");
                Clear();
                BindSliderInfoList();
            }
        }
        var data = {
            InfoID: infoID,
            Category: category,
            HeadingName: headingName,
            SlogenName: slogenName,
            MarqueeName: marqueeName,
            FooterText: footerText,
            PageTitle: pageTitle,
            Status: infoStatus,
            InfoDesc: desc
        };
        var url = '/ProductAdmin/WebAdmin/UpdateSliderInfo/';
        CommonUtility.RequestAjax('POST', url, data, Success, null, null, null);
    }
    //#endregion

    //#region Validation
    $('#ddlCategory').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("DROPDOWN", "ddlCategory")
    });
    $('#txtHeadingName').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtHeadingName");
    });

    $('#txtSlogenName').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtSlogenName");
    });

    $('#txtMarqueeName').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtMarqueeName");
    });
    $('#txtFooterText').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtFooterText")
    });
    $('#txtPageTitle').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtPageTitle");
    });
    //#region Validation


    //#endregion

    //#region clear State controls
    $('body').on('click', "#btnClear", function () {
        Clear();
    });

    function Clear() {

        $("#ddlCategory").val("0");
        $("#txtHeadingName").val("");
        $("#txtSlogenName").val("");
        $("#txtMarqueeName").val("");
        $("#txtFooterText").val("");
        $("#txtPageTitle").val("");
        $("#hdnInfoID").val("");
        $("#txtSliderInfoDesc").val("");

        $("#errtxtHeadingName").html("").hide();
        $("#errddlCategory").html("").hide();
        $("#errtxtSlogenName").html("").hide();
        $("#errtxtMarqueeName").html("").hide();
        $("#errtxtFooterText").html("").hide();
        $("#errtxtPageTitle").html("").hide();
    }
    //#endregion

    //#region delete Category
    $('body').on('click', "#deleteSliderInfo", function () {
        var id = $(this).attr('data-value');
        CommonUtility.DeleteWarningMessagePopIp("Are you sure you want to delete Info", id);
    });
    $('body').on('click', "#finaldelete", function () {
        var id = $(this).attr('data-myval')
        DeleteInfo(id);
    });
    function DeleteInfo(InfoID) {
        var infoID = CommonUtility.ScriptInjection(InfoID).replace(/</g, "").replace(/>/g, "");
        var Success = function (result) {
            if (result != "" || result.length > 0) {
                $("#modal-delete-danger").modal('hide');
                CommonUtility.SucessMessagePopUp("Info Deleted successfully.");
                BindSliderInfoList();
                Clear();
            }
        }
        var data = {
            InfoID: infoID
        };
        var url = '/ProductAdmin/WwbAdmin/DeleteSliderInfo/';
        CommonUtility.RequestAjax('POST', url, data, Success, null, null, null);
    }
    //#endregion

    //#region Edit Category
    $('body').on('click', "#editSliderInfo", function () {
        var infoID = $(this).attr('data-value');
        var Sucess = function (result) {
            if (result != "" || result.length >= 0) {
                $("#ddlCategory").val(result.Category);
                $("#txtHeadingName").val(result.JobTitle);
                $("#txtSlogenName").val(result.JobLocation);
                $("#txtMarqueeName").val(result.JobQualification);
                $("#txtFooterText").val(result.Experience);
                $("#txtPageTitle").val(result.Payment);
                $("#txtSliderInfoDesc").val(result.JobDesc);
                $("#ddlStatus").val(result.Status);
                $("#hdnInfoID").val(result.JobID);
            }
        }
        var data = {
            InfoID: infoID
        };
        var url = '/ProductAdmin/WebAdmin/GetSliderInfoByID/';
        CommonUtility.RequestAjax('GET', url, data, Sucess, null, null, null);
    });
    //#endregion

    //#region Function return
    return {
        BindSliderInfoList: BindSliderInfoList,
        AddInfo: AddInfo,
        Clear: Clear,
        DeleteData: DeleteData,
        DeleteInfo: DeleteInfo
    }
    //#endregion

})();
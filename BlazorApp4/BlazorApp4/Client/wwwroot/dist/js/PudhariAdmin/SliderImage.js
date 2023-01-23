﻿var SliderImage = (function () {
    //#region Ready Function Start Point
    $(document).ready(function () {
        BindSliderImageList();
    });
    //#endregion

    //#region Bind Category List
    function BindSliderImageList() {
        var Success = function (result) {
            if (result != "" || result.length >= 0) {
                $('#sliderInfolist').DataTable({
                    data: result,
                    "bFilter": true,
                    "bLengthChange": true,
                    "bDestroy": true,
                    "lengthMenu": [[5, 10, 25, -1], [5, 10, 25, "All"]],
                    columns: [
                        { data: 'HeadingName' },
                        { data: 'SloganName' },
                        { data: 'MarqueeText' },
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
                            "data": "SliderInfoID",
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

        var url = '/PudhariAdmin/PageAdmin/GetSliderInfoList/';
        CommonUtility.RequestAjax('POST', url, "", Success, null, null, null);
    }
    //#endregion

    //#region Add New Category
    $('body').on('click', "#btnSubmit", function () {
        var formData = new FormData();
        var leftLogo = $("#imgLeftLogo").get(0).files;
        var rightLogo = $("#imgRightLogo").get(0).files;
        var rightLogo = $("#imgRightLogo").get(0).files;
        var slider1 = $("#imgSlider1").get(0).files;
        var slider2 = $("#imgSlider2").get(0).files;
        var slider3 = $("#imgSlider3").get(0).files;
        var slider4 = $("#imgSlider4").get(0).files;
        var slider5 = $("#imgSlider5").get(0).files;

        formData.append("LeftLogo", leftLogo[0]);
        formData.append("FirstName", $('#name').val());
        formData.append("Email", $('#email').val());
        formData.append("Password", $('#password').val());
        formData.append("Gender", $("input[name='gender']:checked").val());
        formData.append("Profile", files[0].name);

        $.ajax({
            type: 'POST',
            url: "/PudhariAdmin/PageAdmin/AddSliderImages/",
            data: formData,
            cache: false,
            contentType: false,
            processData: false,
            success: function (response) {
                if (response == 1) {
                    alert("successfully Profile Updated");
                }
                else {
                    alert("Something Went Wrong..");
                }
            }
        })
    });

    function AddSliderInfo(headingName, sloganName, marqueeText, footerText, pageTitle, status) {
        var Success = function (result) {
            if (result != "" || result.length > 0) {
                Clear();
                BindSliderInfoList();
                if (result === 1)
                    CommonUtility.SucessMessagePopUp("Slider information saved successfully.");
                if (result === -1)
                    CommonUtility.SucessMessagePopUp("Slider information exists, could you try another name.");
            }
        }
        var data = {
            HeadingName: headingName,
            SloganName: sloganName,
            MarqueeText: marqueeText,
            FooterText: footerText,
            PageTitle: pageTitle,
            Status: status
        };
        var url = '/PudhariAdmin/PageAdmin/AddSliderInfo/';
        CommonUtility.RequestAjax('POST', url, data, Success, null, null, null);
    }

    function UpdateSliderInfo(headingName, sloganName, marqueeText, footerText, pageTitle, status, sliderInfoID) {
        var Success = function (result) {
            if (result != "" || result.length > 0) {
                Clear();
                CommonUtility.SucessMessagePopUp("Slider information updated successfully.");
                BindSliderInfoList();
            }
        }
        var data = {
            SliderInfoID: sliderInfoID,
            HeadingName: headingName,
            SloganName: sloganName,
            MarqueeText: marqueeText,
            FooterText: footerText,
            PageTitle: pageTitle,
            Status: status
        };
        var url = '/PudhariAdmin/PageAdmin/UpdateSliderInfo/';
        CommonUtility.RequestAjax('POST', url, data, Success, null, null, null);
    }
    //#endregion

    //#region Validation
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
        CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtFooterText");
    });
    $('#txtPageTitle').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtPageTitle");
    });
    //#endregion

    //#region clear PoliticalParty controls
    $('body').on('click', "#btnClear", function () {
        Clear();
    });

    function Clear() {
        $("#txtHeadingName").val("");
        $("#txtSlogenName").val("");
        $("#txtMarqueeName").val("");
        $("#txtFooterText").val("");
        $("#txtPageTitle").val("");

        $("#hdnSliderInfoID").val("");

        $("#errtxtHeadingName").html("").hide();
        $("#errtxtSlogenName").html("").hide();
        $("#errtxtMarqueeName").html("").hide();
        $("#errtxtFooterText").html("").hide();
        $("#errtxtPageTitle").html("").hide();
    }
    //#endregion

    //#region delete Category
    $('body').on('click', "#deleteSliderInfo", function () {
        var id = $(this).attr('data-value');
        CommonUtility.DeleteWarningMessagePopIp("Are you sure you want to delete slider information", id);
    });
    $('body').on('click', "#finaldelete", function () {
        var id = $(this).attr('data-myval')
        DeleteSliderInfo(id);
    });
    function DeleteSliderInfo(SliderInfoID) {
        var sliderInfoID = CommonUtility.ScriptInjection(SliderInfoID).replace(/</g, "").replace(/>/g, "");
        var Success = function (result) {
            if (result != "" || result.length > 0) {
                $("#modal-delete-danger").modal('hide');
                CommonUtility.SucessMessagePopUp("Slider information deleted successfully.");
                BindSliderInfoList();
                Clear();
            }
        }
        var data = {
            SliderInfoID: sliderInfoID
        };
        var url = '/PudhariAdmin/PageAdmin/DeleteSliderInfo/';
        CommonUtility.RequestAjax('POST', url, data, Success, null, null, null);
    }
    //#endregion

    //#region Edit Category
    $('body').on('click', "#editSliderInfo", function () {
        var sliderInfoID = $(this).attr('data-value');
        var BindSuccess = function (result) {
            if (result != "" || result.length >= 0) {
                $("#txtHeadingName").val(result.HeadingName);
                $("#txtSlogenName").val(result.SloganName);
                $("#txtMarqueeName").val(result.MarqueeText);
                $("#txtFooterText").val(result.FooterText);
                $("#txtPageTitle").val(result.PageTitle);
                $("#ddlStatus").val(result.Status);
                $("#hdnSliderInfoID").val(result.SliderInfoID);
            }
        }
        var data = {
            SliderInfoID: sliderInfoID
        };
        var url = '/PudhariAdmin/PageAdmin/GetSliderInfoByID/';
        CommonUtility.RequestAjax('GET', url, data, BindSuccess, null, null, null);
    });
    //#endregion

    //#region Function return
    return {
        BindSliderinfoList: BindSliderInfoList,
        AddSliderInfo: AddSliderInfo,
        Clear: Clear,
        DeleteSliderIndo: DeleteSliderInfo
    }
    //#endregion

})();



//http://lateshtclick.com/blogpost/upload-fileimage-and-other-data-using-jquery-ajax-call-in-mvc
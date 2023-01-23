var SliderImage = (function () {

    //#region Ready Function Start Point
    $(document).ready(function () {
        BindDropdown("#ddlCategory", "Category", "", true);
        // BindDropdown("#ddlValidity", "PlanValidity", "", true);
        BindSliderImageList();
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
    function BindSliderImageList() {
        var Success = function (result) {
            if (result != "" || result.length >= 0) {
                $('#sliderimagelist').DataTable({
                    data: result,
                    "bFilter": true,
                    "bLengthChange": true,
                    "bDestroy": true,
                    "lengthMenu": [[5, 10, 25, -1], [5, 10, 25, "All"]],
                    columns: [
                        { data: 'Category' },
                        { data: 'LeftLogo' },
                        { data: 'RightLogo' },
                        { data: 'Image1' },
                        { data: 'Image2' },
                        { data: 'Image3' },
                        { data: 'Image4' },
                        {
                            data: "Status",
                            render: function (data, type, row) {
                                if (data === "True") { return "Active" }
                                else return "InActive"
                            }
                        },
                        {
                            "data": "ImageID",
                            "searchable": false,
                            "sortable": false,
                            "render": function (data, type, full, meta) {
                                return '<i class="fas fa-edit" id="editSliderImage" data-value ="' + data + '"></i>|<i class="fas fa-trash-alt" id="deleteSliderImage" data-value ="' + data + '" ></i>';
                            }
                        }
                    ]
                });
            }
        }

        var url = '/ProductAdmin/WebAdmin/GetSliderImageList/';
        CommonUtility.RequestAjax('POST', url, "", Success, null, null, null);
    }
    //#endregion

    //#region Add New State
    $('body').on('click', "#btnSubmit", function () {
        var category = CommonUtility.ScriptInjection($("#ddlCategory").val()).replace(/</g, "").replace(/>/g, "");
        var leftLogo = CommonUtility.ScriptInjection($("#txtLeftLogo").val()).replace(/</g, "").replace(/>/g, "");
        var rightLogo = CommonUtility.ScriptInjection($("#txtRightLogo").val()).replace(/</g, "").replace(/>/g, "");
        var image1 = CommonUtility.ScriptInjection($("#txtSliderImage1").val()).replace(/</g, "").replace(/>/g, "");
        var image2 = CommonUtility.ScriptInjection($("#txtSliderImage2").val()).replace(/</g, "").replace(/>/g, "");
        var image3 = CommonUtility.ScriptInjection($("#txtSliderImage3").val()).replace(/</g, "").replace(/>/g, "");
        var image4 = CommonUtility.ScriptInjection($("#txtSliderImage4").val()).replace(/</g, "").replace(/>/g, "");
        var image5 = CommonUtility.ScriptInjection($("#txtSliderImage5").val()).replace(/</g, "").replace(/>/g, "");
        var imageStatus = CommonUtility.ScriptInjection($("#ddlStatus").val()).replace(/</g, "").replace(/>/g, "");
        var imagedesc = CommonUtility.ScriptInjection($("#txtImageDesc").val()).replace(/</g, "").replace(/>/g, "");
        var imageID = CommonUtility.ScriptInjection($("#hdnImageID").val()).replace(/</g, "").replace(/>/g, "");

        var categoryStatus = CommonValidation.MandetoryControlValueCheck("DROPDOWN", "ddlCategory");
        var leftLogoStatus = CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtLeftLogo");
        var rightLogoStatus = CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtRightLogo");
        var image1Status = CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtSliderImage1");
        var image2Status = CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtSliderImage2");
        var image3Status = CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtSliderImage3");
        var image4Status = CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtSliderImage4");
        var image5Status = CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtSliderImage5");


        if (categoryStatus && leftLogoStatus && rightLogoStatus && image1Status && image2Status && image3Status && image4Status && image5Status ) {
            if (imageID != "")
                UpdateImage(imageID, category, leftLogo, rightLogo, image1, image2, image3, image4, image5, imageStatus, imagedesc)
            else
                AddImage(category, leftLogo, rightLogo, image1, image2, image3, image4, image5, imageStatus, imagedesc);
        }
    });

    function AddImage(category, leftLogo, rightLogo, image1, image2, image3, image4, image5, imageStatus, imagedesc) {

        var Success = function (result) {
            if (result != "" || result.length > 0) {
                Clear();
                BindSliderImageList();
                if (result === 1)
                    CommonUtility.SucessMessagePopUp("Slider Image saved successfully.");
                if (result === -1)
                    CommonUtility.SucessMessagePopUp("image already exists, could you try another name.");
            }
        }
        var data = {
            Category: category,
            LeftLogo: leftLogo,
            RightLogo: rightLogo,
            Image1: image1,
            Image2: image2,
            Image3: image3,
            Image4: image4,
            Image5: image5,
            Status: imageStatus,
            ImageDesc: imagedesc
        };
        var url = '/ProductAdmin/WebAdmin/AddSliderImage/';
        CommonUtility.RequestAjax('POST', url, data, Success, null, null, null);
    }

    function UpdateImage(imageID, category, leftLogo, rightLogo, image1, image2, image3, image4, image5, imageStatus, imagedesc) {

        var Success = function (result) {
            if (result != "" || result.length > 0) {
                CommonUtility.SucessMessagePopUp("Slider updated successfully.");
                Clear();
                BindSliderImageList();
            }
        }
        var data = {
            ImageID: imageID,
            Category: category,
            LeftLogo: leftLogo,
            RightLogo: rightLogo,
            Image1: image1,
            Image2: image2,
            Image3: image3,
            Image4: image4,
            Image5: image5,
            Status: imageStatus,
            ImageDesc: imagedesc
        };
        var url = '/ProductAdmin/WebAdmin/UpdateSliderImage/';
        CommonUtility.RequestAjax('POST', url, data, Success, null, null, null);
    }
    //#endregion

    //#region Validation
    $('#ddlCategory').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("DROPDOWN", "ddlCategory")
    });
    $('#txtLeftLogo').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtLeftLogo");
    });

    $('#txtRightLogo').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtRightLogo");
    });

    $('#txtSliderImage1').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtSliderImage1");
    });
    $('#txtSliderImage2').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtSliderImage2")
    });
    $('#txtSliderImage3').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtSliderImage3");
    });
    $('#txtSliderImage4').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtSliderImage4");
    });
    $('#txtSliderImage5').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtSliderImage5");
    });

    //#region Validation


    //#endregion

    //#region clear State controls
    $('body').on('click', "#btnClear", function () {
        Clear();
    });

    function Clear() {

        $("#ddlCategory").val("0");
        $("#txtLeftLogo").val("");
        $("#txtRightLogo").val("");
        $("#txtSliderImage1").val("");
        $("#txtSliderImage2").val("");
        $("#txtSliderImage3").val("");
        $("#txtSliderImage4").val("");
        $("#txtSliderImage5").val("");
        $("#hdnImageID").val("");
        $("#txtImageDesc").val("");

        $("#errtxtLeftLogo").html("").hide();
        $("#errddlCategory").html("").hide();
        $("#errtxtRightLogo").html("").hide();
        $("#errtxtSliderImage1").html("").hide();
        $("#errtxtSliderImage2").html("").hide();
        $("#errtxtSliderImage3").html("").hide();
        $("#errtxtSliderImage4").html("").hide();
        $("#errtxtSliderImage5").html("").hide();
    }
    //#endregion

    //#region delete Category
    $('body').on('click', "#deleteSliderImage", function () {
        var id = $(this).attr('data-value');
        CommonUtility.DeleteWarningMessagePopIp("Are you sure you want to delete Image", id);
    });
    $('body').on('click', "#finaldelete", function () {
        var id = $(this).attr('data-myval')
        DeleteImage(id);
    });
    function DeleteImage(ImageID) {
        var imageID = CommonUtility.ScriptInjection(ImageID).replace(/</g, "").replace(/>/g, "");
        var Success = function (result) {
            if (result != "" || result.length > 0) {
                $("#modal-delete-danger").modal('hide');
                CommonUtility.SucessMessagePopUp("Image Deleted successfully.");
                BindSliderImageList();
                Clear();
            }
        }
        var data = {
            ImageID: imageID
        };
        var url = '/ProductAdmin/WwbAdmin/DeleteSliderImage/';
        CommonUtility.RequestAjax('POST', url, data, Success, null, null, null);
    }
    //#endregion

    //#region Edit Category
    $('body').on('click', "#editSliderImage", function () {
        var imageID = $(this).attr('data-value');
        var Sucess = function (result) {
            if (result != "" || result.length >= 0) {
                $("#ddlCategory").val(result.Category);
                $("#txtLeftLogo").val(result.LeftLogo);
                $("#txtRightLogo").val(result.RightLogo);
                $("#txtSliderImage1").val(result.Image1);
                $("#txtSliderImage2").val(result.Image2);
                $("#txtSliderImage3").val(result.Image3);
                $("#txtSliderImage4").val(result.Image4);
                $("#txtSliderImage5").val(result.Image5);
                $("#txtImageDesc").val(result.ImageDesc);
                $("#ddlStatus").val(result.Status);
                $("#hdnImageID").val(result.ImageID);
            }
        }
        var data = {
            ImageID: imageID
        };
        var url = '/ProductAdmin/WebAdmin/GetSliderImageByID/';
        CommonUtility.RequestAjax('GET', url, data, Sucess, null, null, null);
    });
    //#endregion

    //#region Function return
    return {
        BindSliderImageList: BindSliderImageList,
        AddImage: AddImage,
        Clear: Clear,
        DeleteData: DeleteData,
        DeleteImage: DeleteImage
    }
    //#endregion

})();
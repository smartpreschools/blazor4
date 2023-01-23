var PhotoGallery = (function () {

    //#region Ready Function Start Point
    $(document).ready(function () {
        BindDropdown("#ddlCategory", "Category", "", true);
        BindDropdown("#ddlPhotoFunction", "PhotoFunction", "", true);
        BindPhotoGalleryList();
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
    function BindPhotoGalleryList() {
        var Success = function (result) {
            if (result != "" || result.length >= 0) {
                $('#PhotoGallerylist').DataTable({
                    data: result,
                    "bFilter": true,
                    "bLengthChange": true,
                    "bDestroy": true,
                    "lengthMenu": [[5, 10, 25, -1], [5, 10, 25, "All"]],
                    columns: [
                        { data: 'Category' },
                        { data: 'ImageName' },
                        { data: 'SelectImage' },
                        { data: 'ImageOrder' },
                        { data: 'PhotoFunction' },
                        {
                            data: "Status",
                            render: function (data, type, row) {
                                if (data === "True") { return "Active" }
                                else return "InActive"
                            }
                        },
                        {
                            "data": "PhotoID",
                            "searchable": false,
                            "sortable": false,
                            "render": function (data, type, full, meta) {
                                return '<i class="fas fa-edit" id="editPhotoGallery" data-value ="' + data + '"></i>|<i class="fas fa-trash-alt" id="deletePhotoGallery" data-value ="' + data + '" ></i>';
                            }
                        }
                    ]
                });
            }
        }

        var url = '/ProductAdmin/WebAdmin/GetPhotoGalleryList/';
        CommonUtility.RequestAjax('POST', url, "", Success, null, null, null);
    }
    //#endregion

    //#region Add New State
    $('body').on('click', "#btnSubmit", function () {
        var category = CommonUtility.ScriptInjection($("#ddlCategory").val()).replace(/</g, "").replace(/>/g, "");
        var photoFunction = CommonUtility.ScriptInjection($("#ddlPhotoFunction").val()).replace(/</g, "").replace(/>/g, "");
        var imageName = CommonUtility.ScriptInjection($("#txtImageName").val()).replace(/</g, "").replace(/>/g, "");
        var imageOrder = CommonUtility.ScriptInjection($("#txtImageOrder").val()).replace(/</g, "").replace(/>/g, "");
        var selectImage = CommonUtility.ScriptInjection($("#txtSelectImage").val()).replace(/</g, "").replace(/>/g, "");
        var photoStatus = CommonUtility.ScriptInjection($("#ddlStatus").val()).replace(/</g, "").replace(/>/g, "");
        var desc = CommonUtility.ScriptInjection($("#txtPhotoDesc").val()).replace(/</g, "").replace(/>/g, "");
        var photoID = CommonUtility.ScriptInjection($("#hdnPhotoID").val()).replace(/</g, "").replace(/>/g, "");

        var categoryStatus = CommonValidation.MandetoryControlValueCheck("DROPDOWN", "ddlCategory");
        var photoFunctionStatus = CommonValidation.MandetoryControlValueCheck("DROPDOWN", "ddlPhotoFunction");
        var imageNameStatus = CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtImageName");
        var imageOrderStatus = CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtImageOrder");
        var selectImageStatus = CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtSelectImage");


        if (categoryStatus && photoFunctionStatus && imageNameStatus && imageOrderStatus && selectImageStatus) {
            if (photoID != "")
                UpdatePhoto(photoID, category, photoFunction, imageName, imageOrder, selectImage, photoStatus, desc)
            else
                AddPhoto(category, photoFunction, imageName, imageOrder, selectImage, photoStatus, desc);
        }
    });

    function AddPhoto(category, photoFunction, imageName, imageOrder, selectImage, photoStatus, desc) {

        var Success = function (result) {
            if (result != "" || result.length > 0) {
                Clear();
                BindPhotoGalleryList();
                if (result === 1)
                    CommonUtility.SucessMessagePopUp("Photo saved successfully.");
                if (result === -1)
                    CommonUtility.SucessMessagePopUp("Photo already exists, could you try another name.");
            }
        }
        var data = {
            Category: category,
            PhotoFunction: photoFunction,
            ImageName: imageName,
            ImageOrder: imageOrder,
            SelectImage: selectImage,
            Status: photoStatus,
            PhotoDesc: desc
        };
        var url = '/ProductAdmin/WebAdmin/AddPhotoGallery/';
        CommonUtility.RequestAjax('POST', url, data, Success, null, null, null);
    }

    function UpdatePhoto(photoID, category, photoFunction, imageName, imageOrder, selectImage, photoStatus, desc) {

        var Success = function (result) {
            if (result != "" || result.length > 0) {
                CommonUtility.SucessMessagePopUp("Website Photo updated successfully.");
                Clear();
                BindPhotoGalleryList();
            }
        }
        var data = {
            PhotoID: photoID,
            Category: category,
            PhotoFunction: photoFunction,
            ImageName: imageName,
            ImageOrder: imageOrder,
            SelectImage: selectImage,
            Status: photoStatus,
            PhotoDesc: desc
        };
        var url = '/ProductAdmin/WebAdmin/UpdatePhotoGallery/';
        CommonUtility.RequestAjax('POST', url, data, Success, null, null, null);
    }
    //#endregion

    //#region Validation
    $('#ddlCategory').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("DROPDOWN", "ddlCategory")
    });
    $('#ddlPhotoFunction').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("DROPDOWN", "ddlPhotoFunction");
    });
    $('#txtImageName').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtImageName");
    });
    $('#txtImageOrder').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtImageOrder")
    });
    $('#txtSelectImage').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtSelectImage");
    });
    //#region Validation


    //#endregion

    //#region clear State controls
    $('body').on('click', "#btnClear", function () {
        Clear();
    });

    function Clear() {
        $("#txtImageName").val("");
        $("#txtSelectImage").val("");
        $("#txtImageOrder").val("");
        $("#ddlCategory").val("0");
        $("#ddlPhotoFunction").val("0");
        $("#hdnPhotoID").val("");
        $("#txtPhotoDesc").val("");

        $("#errtxtImageName").html("").hide();
        $("#errddlCategory").html("").hide();
        $("#errddlPhotoFunction").html("").hide();
        $("#errtxtImageOrder").html("").hide();
        $("#errtxtSelectImage").html("").hide();
    }
    //#endregion

    //#region delete Category
    $('body').on('click', "#deletePhotoGallery", function () {
        var id = $(this).attr('data-value');
        CommonUtility.DeleteWarningMessagePopIp("Are you sure you want to delete Photo", id);
    });
    $('body').on('click', "#finaldelete", function () {
        var id = $(this).attr('data-myval')
        DeletePhoto(id);
    });
    function DeletePhoto(PhotoID) {
        var photoID = CommonUtility.ScriptInjection(PhotoID).replace(/</g, "").replace(/>/g, "");
        var Success = function (result) {
            if (result != "" || result.length > 0) {
                $("#modal-delete-danger").modal('hide');
                CommonUtility.SucessMessagePopUp("Photo Deleted successfully.");
                BindPhotoGalleryList();
                Clear();
            }
        }
        var data = {
            PhotoID: photoID
        };
        var url = '/ProductAdmin/WebAdmin/DeletePhotoGallery/';
        CommonUtility.RequestAjax('POST', url, data, Success, null, null, null);
    }
    //#endregion

    //#region Edit Category
    $('body').on('click', "#editPhotoGallery", function () {
        var photoID = $(this).attr('data-value');
        var Sucess = function (result) {
            if (result != "" || result.length >= 0) {
                $("#ddlCategory").val(result.Category);
                $("#ddlPhotoFunction").val(result.PhotoFunction);
                $("#txtImageName").val(result.ImageName);
                $("#txtImageOrder").val(result.ImageOrder);
                $("#txtSelectImage").val(result.SelectImage);
                $("#txtPhotoDesc").val(result.PhotoDesc);
                $("#ddlPhotoStatus").val(result.Status);
                $("#hdnPhotoID").val(result.PhotoID);
            }
        }
        var data = {
            PhotoID: photoID
        };
        var url = '/ProductAdmin/WebAdmin/GetPhotoGalleryByID/';
        CommonUtility.RequestAjax('GET', url, data, Sucess, null, null, null);
    });
    //#endregion

    //#region Function return
    return {
        BindPhotoGalleryList: BindPhotoGalleryList,
        AddPhoto: AddPhoto,
        Clear: Clear,
        DeleteData: DeleteData,
        DeletePhoto: DeletePhoto
    }
    //#endregion

})();
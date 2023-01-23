var VideoDeatail = (function () {
    //#region Ready Function Start Point
    $(document).ready(function () {
        BindDropdown("#ddlPhotoFunction", "LAActivePhotoHeader", "LAActivePhotoHeader", true);
        BindVideoList();
    });
    //#endregion

    var optionSelect = "<option value='0' selected>Select value.. </option";
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
        var url = '/Common/MasterData/GetDropDownData/';
        if (isAsync)
            CommonUtility.RequestAjax('GET', url, data, BindDropDownData, null, null, null);
        else
            CommonUtility.RequestAjaxAsync('GET', url, data, BindDropDownData, null, null, null);

    }
    //#region Bind Category List
    function BindVideoList() {
        var Success = function (result) {
            if (result != "" || result.length >= 0) {
                $('#videoList').DataTable({
                    data: result,
                    "bFilter": true,
                    "bLengthChange": true,
                    "bDestroy": true,
                    "lengthMenu": [[5, 10, 25, -1], [5, 10, 25, "All"]],
                    columns: [
                        { data: 'HeaderName' },
                        { data: 'PhotoName' },
                        { data: 'PhotoOrder' },
                        { data: 'PhotoURL' },
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
                                return '<i class="fas fa-edit" id="editPhoto" data-value ="' + data + '"></i>|<i class="fas fa-trash-alt" id="deletePhoto" data-value ="' + data + '" ></i>';
                            }
                        }
                    ]
                });
            }
        }

        var url = '/PudhariAdmin/PageAdmin/GetPhotoList/';
        CommonUtility.RequestAjax('POST', url, "", Success, null, null, null);
    }
    //#endregion

    //#region Add New Category
    $('body').on('click', "#btnSubmit", function () {
        var headerName = CommonUtility.ScriptInjection($("#ddlPhotoFunction").val()).replace(/</g, "").replace(/>/g, "");
        var photoName = CommonUtility.ScriptInjection($("#txtPhotoName").val()).replace(/</g, "").replace(/>/g, "");
        var photoOrder = CommonUtility.ScriptInjection($("#txtPhotoOrder").val()).replace(/</g, "").replace(/>/g, "");
        var photoURL = CommonUtility.ScriptInjection($("#txtPhotoUrl").val()).replace(/</g, "").replace(/>/g, "");
        var desc = CommonUtility.ScriptInjection($("#txtDesc").val()).replace(/</g, "").replace(/>/g, "");
        var status = CommonUtility.ScriptInjection($("#ddlStatus").val()).replace(/</g, "").replace(/>/g, "");
        var photoID = CommonUtility.ScriptInjection($("#hdnPhotoID").val()).replace(/</g, "").replace(/>/g, "");

        var headerNameStatus = CommonValidation.MandetoryControlValueCheck("TEXTBOX", "ddlPhotoFunction");
        var photoNameStatus = CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtPhotoName");
        var photoOrderStatus = CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtPhotoOrder");
        var photoURLStatus = CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtPhotoUrl");

        if (headerNameStatus && photoNameStatus && photoOrderStatus && photoURLStatus) {
            if (photoID != "")
                UpdatePhoto(headerName, photoName, photoOrder, photoURL, desc, status, photoID)
            else
                AddPhoto(headerName, photoName, photoOrder, photoURL, desc, status);
        }
    });

    function AddPhoto(headerName, photoName, photoOrder, photoURL, desc, status) {
        var Success = function (result) {
            if (result != "" || result.length > 0) {
                Clear();
                BindPhotoList();
                if (result === 1)
                    CommonUtility.SucessMessagePopUp("Photo saved successfully.");
                if (result === -1)
                    CommonUtility.SucessMessagePopUp("Photo exists, could you try another name.");
            }
        }
        var data = {
            HeaderName: headerName,
            PhotoName: photoName,
            PhotoOrder: photoOrder,
            PhotoURL: photoURL,
            Desc: desc,
            Status: status
        };
        var url = '/PudhariAdmin/PageAdmin/AddPhoto/';
        CommonUtility.RequestAjax('POST', url, data, Success, null, null, null);
    }

    function UpdatePhoto(headerName, photoName, photoOrder, photoURL, desc, status, photoID) {
        var Success = function (result) {
            if (result != "" || result.length > 0) {
                Clear();
                CommonUtility.SucessMessagePopUp("Photo updated successfully.");
                BindPhotoList();
            }
        }
        var data = {
            PhotoID: photoID,
            HeaderName: headerName,
            PhotoName: photoName,
            PhotoOrder: photoOrder,
            PhotoURL: photoURL,
            Desc: desc,
            Status: status
        };
        var url = '/PudhariAdmin/PageAdmin/UpdatePhoto/';
        CommonUtility.RequestAjax('POST', url, data, Success, null, null, null);
    }
    //#endregion

    //#region Validation
    $('#ddlPhotoFunction').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("DROPDOWN", "ddlPhotoFunction");
    });
    $('#txtPhotoName').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtPhotoName");
    });

    $('#txtPhotoOrder').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtPhotoOrder");
    });

    $('#txtPhotoUrl').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtPhotoUrl");
    });


    //#endregion

    //#region clear PoliticalParty controls
    $('body').on('click', "#btnClear", function () {
        Clear();
    });

    function Clear() {
        $("#ddlVideoFunction").val("0");
        $("#txtPhotoName").val("");
        $("#txtPhotoOrder").val("");
        $("#txtPhotoUrl").val("");
        $("#txtDesc").val("");
        $("#hdnPhotoID").val("");
        $("#ddlStatus").val("True");


        $("#errddlPhotoFunction").html("").hide();
        $("#errtxtVideoName").html("").hide();
        $("#errtxtVideoOrder").html("").hide();
        $("#errtxtVideoUrl").html("").hide();
    }
    //#endregion

    //#region delete Category
    $('body').on('click', "#deletePhoto", function () {
        var id = $(this).attr('data-value');
        CommonUtility.DeleteWarningMessagePopIp("Are you sure you want to delete photo", id);
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
                CommonUtility.SucessMessagePopUp("Photo deleted successfully.");
                BindPhotoList();
                Clear();
            }
        }
        var data = {
            PhotoID: photoID
        };
        var url = '/PudhariAdmin/PageAdmin/DeletePhoto/';
        CommonUtility.RequestAjax('POST', url, data, Success, null, null, null);
    }
    //#endregion

    //#region Edit Category
    $('body').on('click', "#editPhoto", function () {
        var photoID = $(this).attr('data-value');
        var BindSuccess = function (result) {
            if (result != "" || result.length >= 0) {
                $("#ddlPhotoFunction").val(result.HeaderName);
                $("#txtPhotoName").val(result.PhotoName);
                $("#txtPhotoOrder").val(result.PhotoOrder);
                $("#txtPhotoUrl").val(result.PhotoURL);
                $("#txtDesc").val(result.Desc);
                $("#ddlStatus").val(result.Status);
                $("#hdnPhotoID").val(result.PhotoID);
            }
        }
        var data = {
            PhotoID: photoID
        };
        var url = '/PudhariAdmin/PageAdmin/GetPhotoByID/';
        CommonUtility.RequestAjax('GET', url, data, BindSuccess, null, null, null);
    });
    //#endregion

    //#region Function return
    return {
        BindPhotoList: BindPhotoList,
        AddPhoto: AddPhoto,
        Clear: Clear,
        DeletePhoto: DeletePhoto
    }
    //#endregion

})();




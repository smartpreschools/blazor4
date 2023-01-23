var Taluka = (function () {

    //#region Ready Function Start Point
    $(document).ready(function () {
        BindDropdown("#ddlCountry", "Country", "", true);
        BindTalukaList();
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
        var url = '/ProductAdmin/Master/GetDropDownData/';
        if (isAsync)
            CommonUtility.RequestAjax('GET', url, data, BindDropDownData, null, null, null);
        else
            CommonUtility.RequestAjaxAsync('GET', url, data, BindDropDownData, null, null, null);

    }

    //#endregion
    //#region Bind Taluka List
    function BindTalukaList() {
        var BindTalukaSuccess = function (result) {
            if (result != "" || result.length >= 0) {
                $('#talukalist').DataTable({
                    data: result,
                    "bFilter": true,
                    "bLengthChange": true,
                    "bDestroy": true,
                    "lengthMenu": [[5, 10, 25, -1], [5, 10, 25, "All"]],
                    columns: [
                        { data: 'Country' },
                        { data: 'State' },
                        { data: 'District' },
                        { data: 'TalukaName' },
                        { data: 'TalukaDesc' },
                        {
                            data: "Status",
                            render: function (data, type, row) {
                                if (data === "True") { return "Active" }
                                else return "InActive"
                            }
                        },
                        {
                            "data": "TalukaID",
                            "searchable": false,
                            "sortable": false,
                            "render": function (data, type, full, meta) {
                                return '<i class="fas fa-edit" id="editTaluka" data-value ="' + data + '"></i>|<i class="fas fa-trash-alt" id="deleteTaluka" data-value ="' + data + '" ></i>';
                            }
                        }
                    ]
                });
            }
        }

        var url = '/ProductAdmin/Master/GetTalukaList/';
        CommonUtility.RequestAjax('POST', url, "", BindTalukaSuccess, null, null, null);
    }
    //#endregion

    //#region Add New Taluka
    $('body').on('click', "#btnSubmit", function () {
        var talukaName = CommonUtility.ScriptInjection($("#txtTalukaName").val()).replace(/</g, "").replace(/>/g, "");
        var talukaDesc = CommonUtility.ScriptInjection($("#txtTalukaDesc").val()).replace(/</g, "").replace(/>/g, "");
        var talukadrpStatus = $("#ddlTalukaStatus").val();
        var talukaID = CommonUtility.ScriptInjection($("#hdnTalukaID").val()).replace(/</g, "").replace(/>/g, "");

        //drpdown value
        var country = CommonUtility.ScriptInjection($("#ddlCountry").val()).replace(/</g, "").replace(/>/g, "");
        var state = CommonUtility.ScriptInjection($("#ddlState").val()).replace(/</g, "").replace(/>/g, "");
        var district = CommonUtility.ScriptInjection($("#ddlDistrict").val()).replace(/</g, "").replace(/>/g, "");


        //validation check
        var talukaStatus = CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtTalukaName");
        var countryStatus = CommonValidation.MandetoryControlValueCheck("DROPDOWN", "ddlCountry");
        var stateStatus = CommonValidation.MandetoryControlValueCheck("DROPDOWN", "ddlState");
        var districtStatus = CommonValidation.MandetoryControlValueCheck("DROPDOWN", "ddlDistrict");

        if (talukaStatus && countryStatus && stateStatus && districtStatus) {
            if (talukaID != "")
                UpdateTaluka(country, state, district, talukaID, talukaName, talukaDesc, talukadrpStatus)
            else
                AddTaluka(country, state, district, talukaName, talukaDesc, talukadrpStatus);
        }
    });

    function AddTaluka(country, state, district, talukaName, talukaDesc, talukaStatus) {

        var TalukaSuccess = function (result) {
            if (result != "" || result.length > 0) {
                Clear();
                BindTalukaList();
                if (result === 1)
                    CommonUtility.SucessMessagePopUp("Taluka saved successfully.");
                if (result === -1)
                    CommonUtility.SucessMessagePopUp("Taluka already exists, could you try another name.");
            }
        }
        var data = {
            Country: country,
            State: state,
            District: district,
            TalukaName: talukaName,
            TalukaDesc: talukaDesc,
            Status: talukaStatus
        };
        var url = '/ProductAdmin/Master/Taluka/';
        CommonUtility.RequestAjax('POST', url, data, TalukaSuccess, null, null, null);
    }

    function UpdateTaluka(country, state, district, talukaID, talukaName, talukaDesc, talukaStatus) {

        var TalukaSuccess = function (result) {
            if (result != "" || result.length > 0) {
                CommonUtility.SucessMessagePopUp("Taluka updated successfully.");
                Clear();
                BindTalukaList();
            }
        }
        var data = {
            TalukaID: talukaID,
            Country: country,
            State: state,
            District: district,
            TalukaName: talukaName,
            TalukaDesc: talukaDesc,
            Status: talukaStatus
        };
        var url = '/ProductAdmin/Master/UpdateTaluka/';
        CommonUtility.RequestAjax('POST', url, data, TalukaSuccess, null, null, null);
    }
    //#endregion

    //#region Validation
    $('#txtTalukaName').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtTalukaName");
    });
    $('#ddlCountry').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("DROPDOWN", "ddlCountry");
        BindDropdown("#ddlState", "State", $("#ddlCountry").val(), true);
    });

    $('#ddlState').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("DROPDOWN", "ddlState");
        BindDropdown("#ddlDistrict", "District", $("#ddlState").val(), true);

    });
    $('#ddlDistrict').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("DROPDOWN", "ddlDistrict");
    });
    //#endregion

    //#region clear Taluka controls
    $('body').on('click', "#btnClear", function () {
        Clear();
    });

    function Clear() {
        $("#txtTalukaName").val("");
        $("#txtTalukaDesc").val("");

        $("#ddlCountry").val("0");
        $("#ddlState").val("0");
        $("#ddlDistrict").val("0");
        $("#ddlState option").remove();
        $("#ddlState").prepend(optionSelect);

        $("#ddlDistrict option").remove();
        $("#ddlDistrict").prepend(optionSelect);

        $("#hdnTalukaID").val("");
        $("#errtxtTalukaName").html("").hide();
        $("#errddlCountry").html("").hide();
        $("#errddlState").html("").hide();
        $("#errddlDistrict").html("").hide();
    }
    //#endregion
    //#region delete Category
    $('body').on('click', "#deleteTaluka", function () {
        var id = $(this).attr('data-value');
        CommonUtility.DeleteWarningMessagePopIp("Are you sure you want to delete taluka", id);
    });
    $('body').on('click', "#finaldelete", function () {
        var id = $(this).attr('data-myval')
        DeleteTaluka(id);
    });
    function DeleteTaluka(TalukaID) {
        var talukaID = CommonUtility.ScriptInjection(TalukaID).replace(/</g, "").replace(/>/g, "");
        var TalukaSuccess = function (result) {
            if (result != "" || result.length > 0) {
                $("#modal-delete-danger").modal('hide');
                CommonUtility.SucessMessagePopUp("Taluka Deleted successfully.");
                BindTalukaList();
                Clear();
            }
        }
        var data = {
            TalukaID: talukaID
        };
        var url = '/ProductAdmin/Master/DeleteTaluka/';
        CommonUtility.RequestAjax('POST', url, data, TalukaSuccess, null, null, null);
    }
    //#endregion

    //#region Edit Category
    $('body').on('click', "#editTaluka", function () {
        var talukaID = $(this).attr('data-value');
        var BindTalukaSuccess = function (result) {
            if (result != "" || result.length >= 0) {
                $("#ddlCountry").val(result.Country);
                BindDropdown("#ddlState", "State", result.Country, false);
                $("#ddlState").val(result.State);
                BindDropdown("#ddlDistrict", "District", result.State, false);
                $("#ddlDistrict").val(result.District);

                $("#txtTalukaName").val(result.TalukaName);
                $("#txtTalukaDesc").val(result.TalukaDesc);
                $("#ddlTalukaStatus").val(result.Status);
                $("#hdnTalukaID").val(result.TalukaID);
            }
        }
        var data = {
            TalukaID: talukaID
        };
        var url = '/ProductAdmin/Master/GetTalukaByID/';
        CommonUtility.RequestAjax('GET', url, data, BindTalukaSuccess, null, null, null);
    });
    //#endregion

    //#region Function return
    return {
        BindTalukaList: BindTalukaList,
        AddTaluka: AddTaluka,
        Clear: Clear,
        DeleteData: DeleteData,
        DeleteTaluka: DeleteTaluka,
        BindDropdown: BindDropdown
    }
    //#endregion

})();


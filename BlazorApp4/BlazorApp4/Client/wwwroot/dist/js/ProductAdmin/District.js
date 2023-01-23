var District = (function () {

    //#region Ready Function Start Point
    $(document).ready(function () {
        BindDropdown("#ddlCountry", "Country", "",true);
        BindDistrictList();
    });
    //#endregion
    var optionSelect = "<option value='0' selected>Select value.. </option";
    //#region Bind DropDown  List
    function BindDropdown(contrlID, DrpName, inputValue,isAsync) {
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

    //#region Bind District List
    function BindDistrictList() {
        var BindDistrictSuccess = function (result) {
            if (result != "" || result.length >= 0) {
                $('#districtlist').DataTable({
                    data: result,
                    "bFilter": true,
                    "bLengthChange": true,
                    "bDestroy": true,
                    "lengthMenu": [[5, 10, 25, -1], [5, 10, 25, "All"]],
                    columns: [
                        { data: 'Country' },
                        { data: 'State' },
                        { data: 'DistrictName' },
                        { data: 'DistrictDesc' },
                        {
                            data: "Status",
                            render: function (data, type, row) {
                                if (data === "True") { return "Active" }
                                else return "InActive"
                            }
                        },
                        {
                            "data": "DistrictID",
                            "searchable": false,
                            "sortable": false,
                            "render": function (data, type, full, meta) {
                                return '<i class="fas fa-edit" id="editDistrict" data-value ="' + data + '"></i>|<i class="fas fa-trash-alt" id="deleteDistrict" data-value ="' + data + '" ></i>';
                            }
                        }
                    ]
                });
            }
        }

        var url = '/ProductAdmin/Master/GetDistrictList/';
        CommonUtility.RequestAjax('POST', url, "", BindDistrictSuccess, null, null, null);
    }
    //#endregion

    //#region Add New Category
    $('body').on('click', "#btnSubmit", function () {
        var districtName = CommonUtility.ScriptInjection($("#txtDistrictName").val()).replace(/</g, "").replace(/>/g, "");
        var districtDesc = CommonUtility.ScriptInjection($("#txtDistrictDesc").val()).replace(/</g, "").replace(/>/g, "");
        var districtStatus = $("#ddlDistrictStatus").val();
        var districtID = CommonUtility.ScriptInjection($("#hdnDistrictID").val()).replace(/</g, "").replace(/>/g, "");

        //drpdown value
        var country = CommonUtility.ScriptInjection($("#ddlCountry").val()).replace(/</g, "").replace(/>/g, "");
        var state = CommonUtility.ScriptInjection($("#ddlState").val()).replace(/</g, "").replace(/>/g, "");

        //validation check
        var districtStatus = CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtDistrictName");
        var countryStatus = CommonValidation.MandetoryControlValueCheck("DROPDOWN", "ddlCountry");
        var stateStatus = CommonValidation.MandetoryControlValueCheck("DROPDOWN", "ddlState");

        if (districtStatus && countryStatus && stateStatus) {
            if (districtID != "")
                UpdateDistrict(country, state, districtID, districtName, districtDesc, districtStatus)
            else
                AddDistrict(country, state, districtName, districtDesc, districtStatus);
        }
    });

    function AddDistrict(country, state, districtName, districtDesc, districtStatus) {

        var DistrictSuccess = function (result) {
            if (result != "" || result.length > 0) {
                Clear();
                BindDistrictList();
                if (result === 1)
                    CommonUtility.SucessMessagePopUp("District saved successfully.");
                if (result === -1)
                    CommonUtility.SucessMessagePopUp("District already exists, could you try another name.");
            }
        }
        var data = {
            Country: country,
            State: state,
            DistrictName: districtName,
            DistrictDesc: districtDesc,
            Status: districtStatus
        };
        var url = '/ProductAdmin/Master/District/';
        CommonUtility.RequestAjax('POST', url, data, DistrictSuccess, null, null, null);
    }

    function UpdateDistrict(country, state, districtID, districtName, districtDesc, districtStatus) {

        var DistrictSuccess = function (result) {
            if (result != "" || result.length > 0) {
                CommonUtility.SucessMessagePopUp("District updated successfully.");
                Clear();
                BindDistrictList();
            }
        }
        var data = {
            DistrictID: districtID,
            Country: country,
            State: state,
            DistrictName: districtName,
            DistrictDesc: districtDesc,
            Status: districtStatus
        };
        var url = '/ProductAdmin/Master/UpdateDistrict/';
        CommonUtility.RequestAjax('POST', url, data, DistrictSuccess, null, null, null);
    }
    //#endregion

    //#region Validation
    $('#txtDistrictName').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtDistrictName");
    });

    $('#ddlCountry').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("DROPDOWN", "ddlCountry");
        BindDropdown("#ddlState", "State", $("#ddlCountry").val(),true);
    });

    $('#ddlState').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("DROPDOWN", "ddlState");

    });
    //#endregion

    //#region clear district controls
    $('body').on('click', "#btnClear", function () {
        Clear();
    });

    function Clear() {
        $("#txtDistrictName").val("");
        $("#txtDistrictDesc").val("");
        $("#ddlCountry").val("0");
        $("#ddlState").val("0");
        $("#ddlState option").remove();
        $("#ddlState").prepend(optionSelect);
        $("#hdnDistrictID").val("");
        $("#errtxtDistrictName").html("").hide();
        $("#errddlCountry").html("").hide();
        $("#errddlState").html("").hide();
    }
    //#endregion

    //#region delete Category
    $('body').on('click', "#deleteDistrict", function () {
        var id = $(this).attr('data-value');
        CommonUtility.DeleteWarningMessagePopIp("Are you sure you want to delete district", id);
    });
    $('body').on('click', "#finaldelete", function () {
        var id = $(this).attr('data-myval')
        DeleteDistrict(id);
    });
    function DeleteDistrict(DistrictID) {
        var districtID = CommonUtility.ScriptInjection(DistrictID).replace(/</g, "").replace(/>/g, "");
        var DistrictSuccess = function (result) {
            if (result != "" || result.length > 0) {
                $("#modal-delete-danger").modal('hide');
                CommonUtility.SucessMessagePopUp("District Deleted successfully.");
                BindDistrictList();
                Clear();
            }
        }
        var data = {
            DistrictID: districtID
        };
        var url = '/ProductAdmin/Master/DeleteDistrict/';
        CommonUtility.RequestAjax('POST', url, data, DistrictSuccess, null, null, null);
    }
    //#endregion

    //#region Edit Category
    $('body').on('click', "#editDistrict", function () {
        var districtID = $(this).attr('data-value');
        var BindDistrictSuccess = function (result) {
            if (result != "" || result.length >= 0) {
                $("#ddlCountry").val(result.Country);
                BindDropdown("#ddlState", "State", result.Country, false);
                $("#ddlState").val(result.State);
                $("#txtDistrictName").val(result.DistrictName);
                $("#txtDistrictDesc").val(result.DistrictDesc);
                $("#ddlDistrictStatus").val(result.Status);
                $("#hdnDistrictID").val(result.DistrictID);
            }
        }
        var data = {
            DistrictID: districtID
        };
        var url = '/ProductAdmin/Master/GetDistrictByID/';
        CommonUtility.RequestAjax('GET', url, data, BindDistrictSuccess, null, null, null);
    });
    //#endregion

    //#region Function return
    return {
        BindDistrictList: BindDistrictList,
        AddDistrict: AddDistrict,
        Clear: Clear,
        DeleteData: DeleteData,
        DeleteDistrict: DeleteDistrict,
        BindDropdown: BindDropdown
    }
    //#endregion

})();


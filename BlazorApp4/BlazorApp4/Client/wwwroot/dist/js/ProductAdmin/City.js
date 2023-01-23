var City = (function () {
    //#region Ready Function Start Point
    $(document).ready(function () {
        BindDropdown("#ddlCountry", "Country", "", true);
        BindCityList();
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
    //#region Bind City List
    function BindCityList() {
        var BindCitySuccess = function (result) {
            if (result != "" || result.length >= 0) {
                $('#citylist').DataTable({
                    data: result,
                    "bFilter": true,
                    "bLengthChange": true,
                    "bDestroy": true,
                    "lengthMenu": [[5, 10, 25, -1], [5, 10, 25, "All"]],
                    columns: [
                        { data: 'Country' },
                        { data: 'State' },
                        { data: 'District' },
                        { data: 'Taluka' },
                        { data: 'CityName' },
                        { data: 'CityDesc' },
                        {
                            data: "Status",
                            render: function (data, type, row) {
                                if (data === "True") { return "Active" }
                                else return "InActive"
                            }
                        },
                        {
                            "data": "CityID",
                            "searchable": false,
                            "sortable": false,
                            "render": function (data, type, full, meta) {
                                return '<i class="fas fa-edit" id="editCity" data-value ="' + data + '"></i>|<i class="fas fa-trash-alt" id="deleteCity" data-value ="' + data + '" ></i>';
                            }
                        }
                    ]
                });
            }
        }
        var url = '/ProductAdmin/Master/GetCityList/';
        CommonUtility.RequestAjax('GET', url, "", BindCitySuccess, null, null, null);
    }
    //#endregion

    //#region Add New City
    $('body').on('click', "#btnSubmit", function () {
        var cityName = CommonUtility.ScriptInjection($("#txtCityName").val()).replace(/</g, "").replace(/>/g, "");
        var cityDesc = CommonUtility.ScriptInjection($("#txtCityDesc").val()).replace(/</g, "").replace(/>/g, "");
        var citydrpStatus = CommonUtility.ScriptInjection($("#ddlCityStatus").val()).replace(/</g, "").replace(/>/g, "");
        var cityID = CommonUtility.ScriptInjection($("#hdnCityID").val()).replace(/</g, "").replace(/>/g, "");

        //drpdown value
        var country = CommonUtility.ScriptInjection($("#ddlCountry").val()).replace(/</g, "").replace(/>/g, "");
        var state = CommonUtility.ScriptInjection($("#ddlState").val()).replace(/</g, "").replace(/>/g, "");
        var district = CommonUtility.ScriptInjection($("#ddlDistrict").val()).replace(/</g, "").replace(/>/g, "");
        var taluka = CommonUtility.ScriptInjection($("#ddlTaluka").val()).replace(/</g, "").replace(/>/g, "");


        //validation check
        var cityStatus = CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtCityName");
        var countryStatus = CommonValidation.MandetoryControlValueCheck("DROPDOWN", "ddlCountry");
        var stateStatus = CommonValidation.MandetoryControlValueCheck("DROPDOWN", "ddlState");
        var districtStatus = CommonValidation.MandetoryControlValueCheck("DROPDOWN", "ddlDistrict");
        var talukaStatus = CommonValidation.MandetoryControlValueCheck("DROPDOWN", "ddlTaluka");

        if (cityStatus && countryStatus && stateStatus && districtStatus && talukaStatus) {
            if (cityID != "")
                UpdateCity(country, state, district, taluka, cityID, cityName, cityDesc, citydrpStatus)
            else
                AddCity(country, state, district, taluka, cityName, cityDesc, citydrpStatus);
        }
    });

    function AddCity(country, state, district, taluka, cityName, cityDesc, citydrpStatus) {
        var CitySuccess = function (result) {
            if (result != "" || result.length > 0) {
                Clear();
                BindCityList();
                if (result === 1)
                    CommonUtility.SucessMessagePopUp("City saved successfully.");
                if (result === -1)
                    CommonUtility.SucessMessagePopUp("City already exists, could you try another name.");
            }
        }
        var data = {
            Country: country,
            State: state,
            District: district,
            Taluka: taluka,
            CityName: cityName,
            CityDesc: cityDesc,
            Status: citydrpStatus
        };
        var url = '/ProductAdmin/Master/City/';
        CommonUtility.RequestAjax('POST', url, data, CitySuccess, null, null, null);
    }
    function UpdateCity(country, state, district, taluka, cityID, cityName, cityDesc, citydrpStatus) {
        var CitySuccess = function (result) {
            if (result != "" || result.length > 0) {
                CommonUtility.SucessMessagePopUp("City updated successfully.");
                Clear();
                BindCityList();
            }
        }
        var data = {
            CityID: cityID,
            Country: country,
            State: state,
            District: district,
            Taluka: taluka,
            CityName: cityName,
            CityDesc: cityDesc,
            Status: citydrpStatus
        };
        var url = '/ProductAdmin/Master/UpdateCity/';
        CommonUtility.RequestAjax('POST', url, data, CitySuccess, null, null, null);
    }
    //#endregion

    //#region Validation
    $('#txtCityName').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtCityName");
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
        BindDropdown("#ddlTaluka", "Taluka", $("#ddlDistrict").val(), true);
    });
    $('#ddlTaluka').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("DROPDOWN", "ddlTaluka");
    });
    //#endregion

    //#region clear City controls
    $('body').on('click', "#btnClear", function () {
        Clear();
    });

    function Clear() {
        $("#txtCityName").val("");
        $("#txtCityDesc").val("");

        $("#ddlCountry").val("0");
        $("#ddlState").val("0");
        $("#ddlDistrict").val("0");
        $("#ddlTaluka").val("0");
        $("#ddlState option").remove();
        $("#ddlState").prepend(optionSelect);

        $("#ddlDistrict option").remove();
        $("#ddlDistrict").prepend(optionSelect);

        $("#ddlTaluka option").remove();
        $("#ddlTaluka").prepend(optionSelect);

        $("#hdnCityID").val("");
        $("#errtxtCityName").html("").hide();
        $("#errddlCountry").html("").hide();
        $("#errddlState").html("").hide();
        $("#errddlDistrict").html("").hide();
        $("#errddlTaluka").html("").hide();
    }
    //#endregion

    //#region delete Category
    $('body').on('click', "#deleteCity", function () {
        var id = $(this).attr('data-value');
        CommonUtility.DeleteWarningMessagePopIp("Are you sure you want to delete city", id);
    });
    $('body').on('click', "#finaldelete", function () {
        var id = $(this).attr('data-myval')
        DeleteCity(id);
    });
    function DeleteCity(CityID) {
        var cityID = CommonUtility.ScriptInjection(CityID).replace(/</g, "").replace(/>/g, "");
        var CitySuccess = function (result) {
            if (result != "" || result.length > 0) {
                $("#modal-delete-danger").modal('hide');
                CommonUtility.SucessMessagePopUp("City Deleted successfully.");
                BindCityList();
                Clear();
            }
        }
        var data = {
            CityID: cityID
        };
        var url = '/ProductAdmin/Master/DeleteCity/';
        CommonUtility.RequestAjax('POST', url, data, CitySuccess, null, null, null);
    }
    //#endregion

    //#region Edit Category
    $('body').on('click', "#editCity", function () {
        var cityID = $(this).attr('data-value');
        var BindCitySuccess = function (result) {
            if (result != "" || result.length >= 0) {

                $("#ddlCountry").val(result.Country);
                BindDropdown("#ddlState", "State", result.Country, false);
                $("#ddlState").val(result.State);

                BindDropdown("#ddlDistrict", "District", result.State, false);
                $("#ddlDistrict").val(result.District);

                BindDropdown("#ddlTaluka", "Taluka", result.District, false);
                $("#ddlTaluka").val(result.Taluka);

                $("#txtCityName").val(result.CityName);
                $("#txtCityDesc").val(result.CityDesc);
                $("#ddlcityStatus").val(result.Status);
                $("#hdnCityID").val(result.CityID);
            }
        }
        var data = {
            CityID: cityID
        };
        var url = '/ProductAdmin/Master/GetCityByID/';
        CommonUtility.RequestAjax('GET', url, data, BindCitySuccess, null, null, null);
    });
    //#endregion

    //#region Function return
    return {
        BindCityList: BindCityList,
        AddCity: AddCity,
        Clear: Clear,
        DeleteData: DeleteData,
        DeleteCity: DeleteCity,
        BindDropdown: BindDropdown
    }
    //#endregion

})();

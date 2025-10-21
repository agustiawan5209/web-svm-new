'use strict';
var __assign =
    (this && this.__assign) ||
    function () {
        __assign =
            Object.assign ||
            function (t) {
                for (var s, i = 1, n = arguments.length; i < n; i++) {
                    s = arguments[i];
                    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
                }
                return t;
            };
        return __assign.apply(this, arguments);
    };
var __awaiter =
    (this && this.__awaiter) ||
    function (thisArg, _arguments, P, generator) {
        function adopt(value) {
            return value instanceof P
                ? value
                : new P(function (resolve) {
                      resolve(value);
                  });
        }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) {
                try {
                    step(generator.next(value));
                } catch (e) {
                    reject(e);
                }
            }
            function rejected(value) {
                try {
                    step(generator['throw'](value));
                } catch (e) {
                    reject(e);
                }
            }
            function step(result) {
                result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
            }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
var __generator =
    (this && this.__generator) ||
    function (thisArg, body) {
        var _ = {
                label: 0,
                sent: function () {
                    if (t[0] & 1) throw t[1];
                    return t[1];
                },
                trys: [],
                ops: [],
            },
            f,
            y,
            t,
            g;
        return (
            (g = { next: verb(0), throw: verb(1), return: verb(2) }),
            typeof Symbol === 'function' &&
                (g[Symbol.iterator] = function () {
                    return this;
                }),
            g
        );
        function verb(n) {
            return function (v) {
                return step([n, v]);
            };
        }
        function step(op) {
            if (f) throw new TypeError('Generator is already executing.');
            while (_)
                try {
                    if (
                        ((f = 1),
                        y &&
                            (t = op[0] & 2 ? y['return'] : op[0] ? y['throw'] || ((t = y['return']) && t.call(y), 0) : y.next) &&
                            !(t = t.call(y, op[1])).done)
                    )
                        return t;
                    if (((y = 0), t)) op = [op[0] & 2, t.value];
                    switch (op[0]) {
                        case 0:
                        case 1:
                            t = op;
                            break;
                        case 4:
                            _.label++;
                            return { value: op[1], done: false };
                        case 5:
                            _.label++;
                            y = op[1];
                            op = [0];
                            continue;
                        case 7:
                            op = _.ops.pop();
                            _.trys.pop();
                            continue;
                        default:
                            if (!((t = _.trys), (t = t.length > 0 && t[t.length - 1])) && (op[0] === 6 || op[0] === 2)) {
                                _ = 0;
                                continue;
                            }
                            if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                                _.label = op[1];
                                break;
                            }
                            if (op[0] === 6 && _.label < t[1]) {
                                _.label = t[1];
                                t = op;
                                break;
                            }
                            if (t && _.label < t[2]) {
                                _.label = t[2];
                                _.ops.push(op);
                                break;
                            }
                            if (t[2]) _.ops.pop();
                            _.trys.pop();
                            continue;
                    }
                    op = body.call(thisArg, _);
                } catch (e) {
                    op = [6, e];
                    y = 0;
                } finally {
                    f = t = 0;
                }
            if (op[0] & 5) throw op[1];
            return { value: op[0] ? op[1] : void 0, done: true };
        }
    };
exports.__esModule = true;
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
var dialog_1 = require('@/components/ui/dialog');
var input_1 = require('@/components/ui/input');
var label_1 = require('@/components/ui/label');
var select_1 = require('@/components/ui/select');
var toast_1 = require('@/components/ui/toast');
var decision_tree_model_1 = require('@/services/decision-tree-model');
var react_1 = require('@inertiajs/react');
var lucide_react_1 = require('lucide-react');
var react_2 = require('react');
var input_error_1 = require('./input-error');
var button_1 = require('./ui/button');
var ClassifyPemeriksaan = function (_a) {
    var data = _a.data,
        setData = _a.setData,
        processing = _a.processing,
        errors = _a.errors,
        kriteria = _a.kriteria,
        setResult = _a.setResult,
        setFeature = _a.setFeature,
        submit = _a.submit;
    var auth = react_1.usePage().props.auth;
    // State management
    var _b = react_2.useState(false),
        loading = _b[0],
        setLoading = _b[1];
    var _c = react_2.useState(null),
        trainingData = _c[0],
        setTrainingData = _c[1];
    var model = react_2.useState(new decision_tree_model_1['default']())[0];
    var _d = react_2.useState(false),
        openDialog = _d[0],
        setOpenDialog = _d[1];
    var _e = react_2.useState(null),
        prediction = _e[0],
        setPrediction = _e[1];
    var _f = react_2.useState(false),
        isError = _f[0],
        setIsError = _f[1];
    var today = new Date();
    var day = today.toISOString().split('T')[0];
    var _g = react_2.useState({
            title: '',
            show: false,
            message: '',
            type: 'success',
        }),
        toast = _g[0],
        setToast = _g[1];
    var handleTanggalLahirChange = function (e) {
        var value = e.target.value;
        var umurIndex = kriteria.findIndex(function (k) {
            return k.nama.toLowerCase().includes('umur');
        });
        setData(function (prev) {
            var _a;
            var usiaBulan = hitungUsiaBulan(value);
            return __assign(__assign({}, prev), {
                tanggal_lahir: value,
                kriteria:
                    (_a = prev.kriteria) === null || _a === void 0
                        ? void 0
                        : _a.map(function (item, i) {
                              return i === umurIndex ? __assign(__assign({}, item), { nilai: usiaBulan.toString() }) : item;
                          }),
            });
        });
    };
    // Input handlers
    var handleChange = react_2.useCallback(
        function (e) {
            var _a = e.target,
                name = _a.name,
                value = _a.value;
            var _b = name.split('.'),
                field = _b[0],
                indexStr = _b[1];
            var index = Number(indexStr);
            if (field === 'kriteria') {
                if (value === '' || /^-?\d*\.?\d*$/.test(value)) {
                    setData(function (prev) {
                        var _a, _b, _c, _d, _e;
                        // Update nilai yang diubah
                        var updatedKriteria =
                            (_a = prev.kriteria) === null || _a === void 0
                                ? void 0
                                : _a.map(function (item, i) {
                                      return i === index ? __assign(__assign({}, item), { nilai: value }) : item;
                                  });
                        // Cari index untuk perhitungan IMT
                        var BBindex = kriteria.findIndex(function (k) {
                            return k.nama.includes('BB');
                        });
                        var TBindex = kriteria.findIndex(function (k) {
                            return k.nama.includes('TB');
                        });
                        var IMTindex = kriteria.findIndex(function (k) {
                            return k.nama.toLowerCase().includes('imt');
                        });
                        // Jika yang diubah adalah BB atau TB, hitung IMT
                        if ((index === BBindex || index === TBindex) && IMTindex !== -1) {
                            var nilaiBB_1 =
                                index === BBindex
                                    ? Number(value)
                                    : Number(
                                          (_c =
                                              (_b = updatedKriteria === null || updatedKriteria === void 0 ? void 0 : updatedKriteria[BBindex]) ===
                                                  null || _b === void 0
                                                  ? void 0
                                                  : _b.nilai) !== null && _c !== void 0
                                              ? _c
                                              : 0,
                                      );
                            var nilaiTB_1 =
                                index === TBindex
                                    ? Number(value)
                                    : Number(
                                          (_e =
                                              (_d = updatedKriteria === null || updatedKriteria === void 0 ? void 0 : updatedKriteria[TBindex]) ===
                                                  null || _d === void 0
                                                  ? void 0
                                                  : _d.nilai) !== null && _e !== void 0
                                              ? _e
                                              : 0,
                                      );
                            // Hitung IMT hanya jika kedua nilai valid
                            if (nilaiBB_1 > 0 && nilaiTB_1 > 0) {
                                return __assign(__assign({}, prev), {
                                    kriteria:
                                        updatedKriteria === null || updatedKriteria === void 0
                                            ? void 0
                                            : updatedKriteria.map(function (item, i) {
                                                  return i === IMTindex
                                                      ? __assign(__assign({}, item), { nilai: hitungIMT(nilaiBB_1, nilaiTB_1) })
                                                      : item;
                                              }),
                                });
                            }
                        }
                        return __assign(__assign({}, prev), { kriteria: updatedKriteria });
                    });
                }
            } else {
                setData(function (prev) {
                    var _a;
                    return __assign(__assign({}, prev), ((_a = {}), (_a[name] = value), _a));
                });
            }
        },
        [kriteria, setData],
    );
    // select handlers
    var handleSelectChange = react_2.useCallback(
        function (name, value) {
            var index = Number(name);
            setData(function (prev) {
                var _a;
                return __assign(__assign({}, prev), {
                    kriteria:
                        (_a = prev.kriteria) === null || _a === void 0
                            ? void 0
                            : _a.map(function (item, i) {
                                  return i === index ? __assign(__assign({}, item), { nilai: value }) : item;
                              }),
                });
            });
        },
        [setData],
    );
    // Load data saat komponen mount
    react_2.useEffect(function () {
        var loadData = function () {
            return __awaiter(void 0, void 0, void 0, function () {
                var data_1, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            setLoading(true);
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 4, 5, 6]);
                            return [4 /*yield*/, model.fetchAndProcessData()];
                        case 2:
                            data_1 = _a.sent();
                            return [4 /*yield*/, model.loadModel()];
                        case 3:
                            _a.sent();
                            setTrainingData(data_1);
                            return [3 /*break*/, 6];
                        case 4:
                            error_1 = _a.sent();
                            setToast({
                                title: 'Error',
                                show: true,
                                message: error_1.message + ', Lakukan training pada halaman decision Tree sebelum masuk Pemeriksaan Nutrisi Anak',
                                type: 'error',
                            });
                            setIsError(true);
                            return [3 /*break*/, 6];
                        case 5:
                            setLoading(false);
                            return [7 /*endfinally*/];
                        case 6:
                            return [2 /*return*/];
                    }
                });
            });
        };
        loadData();
    }, []);
    var handlePredict = function (e) {
        return __awaiter(void 0, void 0, void 0, function () {
            var feature, result, error_2;
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        e.preventDefault();
                        setLoading(true);
                        _e.label = 1;
                    case 1:
                        _e.trys.push([1, 5, 6, 7]);
                        feature =
                            (_a = data.kriteria) === null || _a === void 0
                                ? void 0
                                : _a.map(function (item) {
                                      var nilai = item.nilai;
                                      // Cek jika nilai null atau undefined
                                      if (nilai === null || nilai === undefined || nilai === '' || data.rme === '') {
                                          setToast({
                                              title: 'Error',
                                              show: true,
                                              message: 'Nilai No.RME, jenis kelamin, usia,  BB, TB, IMT Tidak Boleh Kosong ',
                                              type: 'error',
                                          });
                                      }
                                      var lowerItem = String(nilai).toLowerCase();
                                      if (lowerItem === 'laki-laki') {
                                          return 0;
                                      } else if (lowerItem === 'perempuan') {
                                          return 1;
                                      } else if (!isNaN(parseFloat(nilai)) && isFinite(nilai)) {
                                          return parseFloat(nilai); // ubah ke angka
                                      } else {
                                          return nilai; // biarkan tetap string
                                      }
                                  });
                        if (
                            !(
                                data.nik === '' ||
                                (data.rme === '' && auth.role == 'admin') ||
                                data.nama === '' ||
                                data.orang_tua_id === '' ||
                                data.tempat_lahir === ''
                            )
                        )
                            return [3 /*break*/, 2];
                        setToast({
                            title: 'Error',
                            show: true,
                            message: 'NIK, RME, Nama, Orang Tua, Tempat Lahir Tidak Boleh Kosong ',
                            type: 'error',
                        });
                        return [3 /*break*/, 4];
                    case 2:
                        return [4 /*yield*/, model.predict([feature !== null && feature !== void 0 ? feature : []])];
                    case 3:
                        result = _e.sent();
                        if (result.error) {
                            setToast({
                                title: 'Hasil Prediksi',
                                show: true,
                                message: result.error,
                                type: 'success',
                            });
                        } else {
                            setPrediction(result);
                            if (setFeature) {
                                setFeature(data.kriteria);
                            }
                            if (result.label !== undefined && result.label !== null) {
                                setData(
                                    __assign(__assign({}, data), {
                                        label: (_b = result.label.toString()) !== null && _b !== void 0 ? _b : 'tidak dikenali',
                                    }),
                                );
                                setData(
                                    __assign(__assign({}, data), {
                                        rekomendasi:
                                            (_d = (_c = result.rekomendasi) === null || _c === void 0 ? void 0 : _c.toString()) !== null &&
                                            _d !== void 0
                                                ? _d
                                                : 'tidak dikenali',
                                    }),
                                );
                                if (setResult) {
                                    setResult(result);
                                }
                                handleOpenDialog();
                            }
                        }
                        _e.label = 4;
                    case 4:
                        return [3 /*break*/, 7];
                    case 5:
                        error_2 = _e.sent();
                        console.error(error_2);
                        setToast({
                            title: 'Hasil Prediksi',
                            show: true,
                            message: error_2,
                            type: 'success',
                        });
                        return [3 /*break*/, 7];
                    case 6:
                        setLoading(false);
                        return [7 /*endfinally*/];
                    case 7:
                        return [2 /*return*/];
                }
            });
        });
    };
    var handleOpenDialog = function () {
        setOpenDialog(true);
    };
    // Handle Input data anak
    var tahunLalu = new Date(today);
    tahunLalu.setFullYear(today.getFullYear() - 1);
    var minDate = tahunLalu.toISOString().split('T')[0];
    function hitungUsia(tanggalLahir) {
        var birthDate = new Date(tanggalLahir);
        var today = new Date();
        var tahun = today.getFullYear() - birthDate.getFullYear();
        var bulan = today.getMonth() - birthDate.getMonth();
        var hari = today.getDate() - birthDate.getDate();
        if (hari < 0) {
            bulan--;
            hari += new Date(today.getFullYear(), today.getMonth(), 0).getDate(); // total hari bulan sebelumnya
        }
        if (bulan < 0) {
            tahun--;
            bulan += 12;
        }
        return tahun + ' tahun, ' + bulan + ' bulan, ' + hari + ' hari';
    }
    function hitungUsiaBulan(tanggalLahir) {
        var birthDate = new Date(tanggalLahir);
        var today = new Date();
        var tahun = today.getFullYear() - birthDate.getFullYear();
        var bulan = today.getMonth() - birthDate.getMonth();
        var hari = today.getDate() - birthDate.getDate();
        // total bulan = selisih tahun * 12 + selisih bulan
        var totalBulan = tahun * 12 + bulan;
        // kalau tanggal hari ini < tanggal lahir, berarti belum genap 1 bulan
        if (hari < 0) {
            totalBulan -= 1;
        }
        return totalBulan.toString();
    }
    var predictionColor = react_2.useMemo(
        function () {
            if (!prediction) return '';
            switch (prediction.label) {
                case 'Buruk':
                    return 'bg-red-100 border-red-300 text-red-800';
                case 'Cukup':
                    return 'bg-yellow-100 border-yellow-300 text-yellow-800';
                case 'Baik':
                    return 'bg-green-100 border-green-300 text-green-800';
                default:
                    return 'bg-blue-100 border-blue-300 text-blue-800';
            }
        },
        [prediction],
    );
    var hitungIMT = function (berat, tinggi) {
        // tinggi dalam meter
        var tb = tinggi / 100;
        var imt = berat / (tb * tb);
        return imt.toFixed(3);
    };
    return react_2['default'].createElement(
        'div',
        { className: 'mx-auto max-w-7xl px-4 py-8' },
        react_2['default'].createElement(toast_1.Toast, {
            open: toast.show,
            onOpenChange: function () {
                return setToast(function (prev) {
                    return __assign(__assign({}, prev), { show: false });
                });
            },
            title: toast.title,
            description: toast.message,
            duration: 10000,
            variant: toast.type,
        }),
        react_2['default'].createElement(
            'div',
            { className: 'grid grid-cols-1 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm' },
            react_2['default'].createElement(
                'div',
                { className: 'p-6 ring-1 md:p-8' },
                react_2['default'].createElement(
                    'form',
                    {
                        onSubmit: function (e) {
                            return handlePredict(e);
                        },
                        className: 'space-y-6',
                    },
                    react_2['default'].createElement(
                        'div',
                        { className: 'mt-4 grid grid-cols-2 gap-3' },
                        react_2['default'].createElement(
                            'div',
                            { className: 'grid gap-2' },
                            react_2['default'].createElement(label_1.Label, { htmlFor: 'nik' }, 'NIK'),
                            react_2['default'].createElement(input_1.Input, {
                                id: 'nik',
                                type: 'text',
                                required: true,
                                autoFocus: true,
                                tabIndex: 1,
                                autoComplete: 'nik',
                                value: data.nik,
                                onChange: function (e) {
                                    return setData(__assign(__assign({}, data), { nik: e.target.value }));
                                },
                                disabled: processing,
                                placeholder: 'Masukkan Nik Balita',
                            }),
                            react_2['default'].createElement(input_error_1['default'], { message: errors.nik, className: 'mt-2' }),
                        ),
                        react_2['default'].createElement(
                            'div',
                            { className: 'grid gap-2' },
                            react_2['default'].createElement(label_1.Label, { htmlFor: 'nama' }, 'Nama Balita/Anak'),
                            react_2['default'].createElement(input_1.Input, {
                                id: 'nama',
                                type: 'text',
                                required: true,
                                autoFocus: true,
                                tabIndex: 1,
                                autoComplete: 'nama',
                                value: data.nama,
                                onChange: function (e) {
                                    return setData(__assign(__assign({}, data), { nama: e.target.value }));
                                },
                                disabled: processing,
                                placeholder: 'Nama Balita/Anak',
                            }),
                            react_2['default'].createElement(input_error_1['default'], { message: errors.nama, className: 'mt-2' }),
                        ),
                        react_2['default'].createElement(
                            'div',
                            { className: 'flex items-center gap-2' },
                            react_2['default'].createElement(
                                'div',
                                { className: 'col-span-1 grid gap-2' },
                                react_2['default'].createElement(label_1.Label, { htmlFor: 'tempat_lahir' }, 'Tempat'),
                                react_2['default'].createElement(input_1.Input, {
                                    id: 'tempat_lahir',
                                    type: 'text',
                                    required: true,
                                    tabIndex: 2,
                                    autoComplete: 'tempat_lahir',
                                    value: data.tempat_lahir,
                                    onChange: function (e) {
                                        return setData(__assign(__assign({}, data), { tempat_lahir: e.target.value }));
                                    },
                                    disabled: processing,
                                    placeholder: 'tempat_lahir.......',
                                }),
                                react_2['default'].createElement(input_error_1['default'], { message: errors.tempat_lahir }),
                            ),
                            react_2['default'].createElement(
                                'div',
                                { className: 'col-span-2 grid gap-2' },
                                react_2['default'].createElement(label_1.Label, { htmlFor: 'tanggal_lahir' }, 'Tanggal Lahir'),
                                react_2['default'].createElement(input_1.Input, {
                                    id: 'tanggal_lahir',
                                    type: 'date',
                                    required: true,
                                    max: minDate,
                                    tabIndex: 2,
                                    autoComplete: 'tanggal_lahir',
                                    value: data.tanggal_lahir,
                                    onChange: function (e) {
                                        return handleTanggalLahirChange(e);
                                    },
                                    disabled: processing,
                                    placeholder: 'tanggal lahir.......',
                                }),
                                react_2['default'].createElement(input_error_1['default'], { message: errors.tanggal_lahir }),
                            ),
                        ),
                    ),
                    react_2['default'].createElement(
                        'div',
                        { className: 'grid grid-cols-1 gap-6 md:grid-cols-2' },
                        kriteria.map(function (item, index) {
                            var _a, _b, _c, _d, _e;
                            var value =
                                (_c =
                                    (_b = (_a = data.kriteria) === null || _a === void 0 ? void 0 : _a[index]) === null || _b === void 0
                                        ? void 0
                                        : _b.nilai) !== null && _c !== void 0
                                    ? _c
                                    : '';
                            return react_2['default'].createElement(
                                'div',
                                { key: index, className: 'space-y-2' },
                                react_2['default'].createElement(
                                    label_1.Label,
                                    { className: 'text-sm font-medium text-gray-700' },
                                    item.nama.charAt(0).toUpperCase() + item.nama.slice(1),
                                ),
                                item.nama.toLowerCase() === 'jenis kelamin'
                                    ? react_2['default'].createElement(
                                          select_1.Select,
                                          {
                                              value:
                                                  ((_e = (_d = data.kriteria) === null || _d === void 0 ? void 0 : _d[index]) === null ||
                                                  _e === void 0
                                                      ? void 0
                                                      : _e.nilai) || '',
                                              required: true,
                                              onValueChange: function (val) {
                                                  setData(function (prev) {
                                                      var _a;
                                                      return __assign(__assign({}, prev), {
                                                          jenis_kelamin: val,
                                                          kriteria:
                                                              (_a = prev.kriteria) === null || _a === void 0
                                                                  ? void 0
                                                                  : _a.map(function (item, i) {
                                                                        return i === index ? __assign(__assign({}, item), { nilai: val }) : item;
                                                                    }),
                                                      });
                                                  });
                                              },
                                          },
                                          react_2['default'].createElement(
                                              select_1.SelectTrigger,
                                              { className: 'w-full' },
                                              react_2['default'].createElement(select_1.SelectValue, { placeholder: 'Select Jenis Kelamin' }),
                                          ),
                                          react_2['default'].createElement(
                                              select_1.SelectContent,
                                              null,
                                              ['Laki-laki', 'Perempuan'].map(function (gender, idx) {
                                                  return react_2['default'].createElement(select_1.SelectItem, { key: idx, value: gender }, gender);
                                              }),
                                          ),
                                      )
                                    : react_2['default'].createElement(input_1.Input, {
                                          type: 'text',
                                          name: 'kriteria.' + index,
                                          value: value,
                                          onChange: handleChange,
                                          placeholder: 'Enter ' + item.nama,
                                          disabled: processing,
                                          readOnly: item.nama.toLowerCase().includes('imt') || item.nama.toLowerCase().includes('umur'),
                                          required: true,
                                      }),
                            );
                        }),
                    ),
                    react_2['default'].createElement(
                        'div',
                        { className: 'flex flex-wrap gap-3 pt-4' },
                        react_2['default'].createElement(
                            button_1.Button,
                            {
                                type: 'submit',
                                disabled: loading || !model || isError,
                                className: 'bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600',
                            },
                            loading ? react_2['default'].createElement(lucide_react_1.Loader2, { className: 'mr-2 h-4 w-4 animate-spin' }) : null,
                            'Mulai Pemeriksaan Nutrisi',
                        ),
                    ),
                ),
            ),
            react_2['default'].createElement(
                dialog_1.Dialog,
                { open: openDialog, onOpenChange: setOpenDialog },
                react_2['default'].createElement(dialog_1.DialogTrigger, null),
                react_2['default'].createElement(
                    dialog_1.DialogContent,
                    { className: 'max-w-md' },
                    react_2['default'].createElement(
                        dialog_1.DialogTitle,
                        null,
                        react_2['default'].createElement(
                            'div',
                            { className: 'flex items-center gap-3 text-foreground' },
                            react_2['default'].createElement(
                                'div',
                                { className: 'flex h-8 w-8 items-center justify-center rounded-full bg-green-500/10' },
                                react_2['default'].createElement(lucide_react_1.LeafyGreen, {
                                    className:
                                        'h-4 w-4 ' +
                                        ((prediction === null || prediction === void 0 ? void 0 : prediction.label) == 'Baik'
                                            ? 'text-green-500'
                                            : 'text-red-500'),
                                }),
                            ),
                            react_2['default'].createElement('span', { className: 'text-lg font-medium' }, 'Hasil Pemeriksaan Nutrisi'),
                        ),
                    ),
                    react_2['default'].createElement(
                        'div',
                        { className: 'mt-4 space-y-4' },
                        react_2['default'].createElement(
                            'div',
                            { className: 'grid grid-cols-2 gap-4' },
                            react_2['default'].createElement(
                                'div',
                                { className: 'space-y-1' },
                                react_2['default'].createElement('p', { className: 'text-sm font-medium text-muted-foreground' }, 'Nama Anak'),
                                react_2['default'].createElement('p', { className: 'text-sm font-medium' }, data.nama),
                            ),
                            react_2['default'].createElement(
                                'div',
                                { className: 'space-y-1' },
                                react_2['default'].createElement('p', { className: 'text-sm font-medium text-muted-foreground' }, 'Tanggal Lahir'),
                                react_2['default'].createElement('p', { className: 'text-sm font-medium' }, data.tanggal_lahir),
                            ),
                            react_2['default'].createElement(
                                'div',
                                { className: 'space-y-1' },
                                react_2['default'].createElement('p', { className: 'text-sm font-medium text-muted-foreground' }, 'Usia'),
                                react_2['default'].createElement('p', { className: 'text-sm font-medium' }, hitungUsia(data.tanggal_lahir)),
                            ),
                            react_2['default'].createElement(
                                'div',
                                { className: 'space-y-1' },
                                react_2['default'].createElement(
                                    'p',
                                    { className: 'text-sm font-medium text-muted-foreground ' + predictionColor },
                                    'Status Nutrisi',
                                ),
                                react_2['default'].createElement(
                                    'p',
                                    {
                                        className:
                                            'h-auto w-max flex-shrink-0 rounded-full px-2 ' +
                                            ((prediction === null || prediction === void 0 ? void 0 : prediction.label) === 'Buruk'
                                                ? 'bg-red-500'
                                                : (prediction === null || prediction === void 0 ? void 0 : prediction.label) === 'Cukup'
                                                  ? 'bg-yellow-500'
                                                  : (prediction === null || prediction === void 0 ? void 0 : prediction.label) === 'Baik'
                                                    ? 'bg-green-500'
                                                    : 'bg-blue-500'),
                                    },
                                    prediction === null || prediction === void 0 ? void 0 : prediction.label,
                                ),
                            ),
                        ),
                        react_2['default'].createElement(
                            'div',
                            { className: 'space-y-1' },
                            react_2['default'].createElement('p', { className: 'text-sm font-medium text-muted-foreground' }, 'Jenis Makanan'),
                            react_2['default'].createElement(
                                'p',
                                { className: 'text-sm font-medium' },
                                prediction === null || prediction === void 0 ? void 0 : prediction.rekomendasi,
                            ),
                        ),
                    ),
                    react_2['default'].createElement(
                        dialog_1.DialogFooter,
                        { className: 'mt-6' },
                        react_2['default'].createElement(
                            button_1.Button,
                            { type: 'button', variant: 'default', size: 'sm', className: 'w-full', disabled: processing, onClick: submit },
                            processing
                                ? react_2['default'].createElement(lucide_react_1.LoaderCircle, { className: 'mr-2 h-4 w-4 animate-spin' })
                                : null,
                            'Simpan',
                        ),
                    ),
                ),
            ),
        ),
    );
};
exports['default'] = ClassifyPemeriksaan;

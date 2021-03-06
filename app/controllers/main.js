function getEle(id) {
  return document.getElementById(id);
}

var services = new Services();
var validation = new Validation();
var arr = [];

function getListTeacher() {
  services
    .fetchData()
    .then((res) => {
      arr = res.data;
      renderHTML(res.data);
    })
    .catch((err) => console.log(err))
    .finally(() => {});
  return arr;
}
getListTeacher();

function trungTaiKhoan(taiKhoan) {
  services
    .getTeacherByTaiKhoan(taiKhoan)
    .then((res) => {
      let taiKhoan = getEle("TaiKhoan").value;
      if (res.data.taiKhoan === taiKhoan) {
        return false;
      }
      return true;
    })
    .catch((err) => console.log(err));
}

function renderHTML(data) {
  let content = "";
  for (let i = 0; i < data.length; i++) {
    let teacher = data[i];
    let { id, taiKhoan, hoTen, matKhau, email, loaiND, ngonNgu } = teacher;
    content += `
        <tr>
            <td>${i + 1}</td>
            <td>${taiKhoan}</td>
            <td>${matKhau}</td>
            <td>${hoTen}</td>
            <td>${email}</td>
            <td>${ngonNgu}</td>
            <td>${loaiND}</td>
            <td>
                <button class="btn btn-info" data-toggle="modal" data-target="#myModal" onclick="editTeacher(${id})">Edit</button>
                <button class="btn btn-danger" onclick="deleteTeacher(${id})">Delete</button>
            </td>
        </tr>
    `;
  }
  getEle("tblDanhSachNguoiDung").innerHTML = content;
}

function deleteTeacher(id) {
  let promise = services.deleteUserById(id);
  promise.then(() => getListTeacher()).catch((err) => console.log(err));
}

function editTeacher(id) {
  document.getElementsByClassName("modal-title")[0].innerHTML =
    "Update Teacher";
  let footer = `<button class="btn btn-success" onclick="updateTeacher(${id})">Update</button>`;
  document.getElementsByClassName("modal-footer")[0].innerHTML = footer;
  clearMessage();

  services
    .getTeacherById(id)
    .then((res) => {
      let {
        taiKhoan,
        hoTen,
        matKhau,
        email,
        loaiND,
        ngonNgu,
        moTa,
        hinhAnh,
      } = res.data;
      getEle("TaiKhoan").value = taiKhoan;
      getEle("TaiKhoan").disabled = true;
      getEle("HoTen").value = hoTen;
      getEle("MatKhau").value = matKhau;
      getEle("Email").value = email;
      getEle("loaiNgonNgu").value = ngonNgu;
      getEle("loaiNguoiDung").value = loaiND;
      getEle("MoTa").value = moTa;
      getEle("HinhAnh").value = hinhAnh;
    })
    .catch((err) => console.log(err));
}

function updateTeacher(id) {
  let taiKhoan = getEle("TaiKhoan").value;
  let hoTen = getEle("HoTen").value;
  let matKhau = getEle("MatKhau").value;
  let email = getEle("Email").value;
  let ngonNgu = getEle("loaiNgonNgu").value;
  let loaiND = getEle("loaiNguoiDung").value;
  let moTa = getEle("MoTa").value;
  let hinhAnh = getEle("HinhAnh").value;
  let valid = checkValid();
  if (valid) {
    let teacher = new User(
      id,
      taiKhoan,
      hoTen,
      matKhau,
      email,
      loaiND === "GV" ? "GV" : alert("Ph???i ch???n lo???i ng?????i d??ng GV"),
      ngonNgu,
      moTa,
      hinhAnh
    );
    services
      .updateTeacher(id, teacher)
      .then((res) => console.log(res))
      .catch((err) => console.log(err))
      .finally(() => {
        getListTeacher();
        document.getElementsByClassName("close")[0].click();
      });
  }
}

getEle("btnThemNguoiDung").addEventListener("click", () => {
  document.getElementsByClassName("modal-title")[0].innerHTML = "Add Teacher";
  let footer = `<button class="btn btn-success" onclick="addTeacher()">Add</button>`;
  document.getElementsByClassName("modal-footer")[0].innerHTML = footer;
  getEle("TaiKhoan").disabled = false;
  clearFields();
  clearMessage();
});

function addTeacher() {
  let taiKhoan = getEle("TaiKhoan").value;
  let hoTen = getEle("HoTen").value;
  let matKhau = getEle("MatKhau").value;
  let email = getEle("Email").value;
  let ngonNgu = getEle("loaiNgonNgu").value;
  let loaiND = getEle("loaiNguoiDung").value;
  let moTa = getEle("MoTa").value;
  let hinhAnh = getEle("HinhAnh").value;
  let valid = checkValid();
  if (valid) {
    let teacher = new User(
      "",
      taiKhoan,
      hoTen,
      matKhau,
      email,
      loaiND,
      ngonNgu,
      moTa,
      hinhAnh
    );
    services
      .addTeacher(teacher)
      .then((res) => console.log(res))
      .catch((err) => console.log(err))
      .finally(() => {
        getListTeacher();
        document.getElementsByClassName("close")[0].click();
      });
  }
}

function checkValid() {
  let taiKhoan = getEle("TaiKhoan").value;
  let hoTen = getEle("HoTen").value;
  let matKhau = getEle("MatKhau").value;
  let email = getEle("Email").value;
  let ngonNgu = getEle("loaiNgonNgu").value;
  let loaiND = getEle("loaiNguoiDung").value;
  let moTa = getEle("MoTa").value;
  let hinhAnh = getEle("HinhAnh").value;
  let isValid = true;
  /* Tai khoan */
  isValid &=
    validation.ktraRong(
      taiKhoan,
      "tbTaiKhoan",
      "T??i kho???n kh??ng ???????c ????? tr???ng"
    ) &&
    validation.ktraTrung(taiKhoan, "tbTaiKhoan", "T??i kho???n ???? t???n t???i", arr);

  /* Ho ten */
  isValid &=
    validation.ktraRong(hoTen, "tbHoTen", "H??? t??n kh??ng ???????c ????? tr???ng") &&
    validation.kiemTraKiTu(
      hoTen,
      "tbHoTen",
      "H??? t??n kh??ng c?? k?? t??? ?????c bi???t ho???c s???"
    );

  /* Mat khau */
  isValid &=
    validation.ktraRong(matKhau, "tbMatKhau", "M???t kh???u kh??ng ???????c ????? tr???ng") &&
    validation.kiemTraDoDaiKiTu(
      matKhau,
      "tbMatKhau",
      "M???t kh???u t??? 6 - 8 k?? t???",
      6,
      8
    ) &&
    validation.kiemTraMatKhau(
      matKhau,
      "tbMatKhau",
      "M???t kh???u ??t nh???t 1 ch??? hoa, 1 ch??? th?????ng, 1 k?? t??? ?????c bi???t v?? 1 s???"
    );

  /* Email */
  isValid &=
    validation.ktraRong(email, "tbEmail", "Email kh??ng ???????c ????? tr???ng") &&
    validation.kiemTraEmail(email, "tbEmail", "Email kh??ng ????ng ?????nh d???ng");

  /* Hinh Anh */
  isValid = validation.ktraRong(
    hinhAnh,
    "tbImage",
    "H??nh ???nh kh??ng ???????c ????? tr???ng"
  );

  /* Loai nguoi dung */
  isValid = validation.ktraRong(loaiND, "tbLoaiND", "Ph???i ch???n");

  /* Ngon ngu */
  isValid = validation.ktraRong(ngonNgu, "tbNgonNgu", "Ph???i ch???n");

  /* Mo ta */
  isValid &=
    validation.ktraRong(moTa, "tbMoTa", "M?? t??? kh??ng ???????c ????? tr???ng") &&
    validation.kiemTraDoDaiKiTu(moTa, "tbMoTa", "Kh??ng qu?? 60 k?? t???", 1, 60);

  return isValid;
}

const clearFields = () => {
  const fields = document.querySelectorAll(".form-control");
  for (let i = 0; i < fields.length; i++) {
    fields[i].value = "";
  }
};

const clearMessage = () => {
  const message = document.querySelectorAll(".thongbao");
  for (let i = 0; i < message.length; i++) {
    message[i].innerHTML = "";
  }
};

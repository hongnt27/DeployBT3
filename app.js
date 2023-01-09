import {
    debounce
} from './debounce.js'
const employees_list = document.querySelector('.container__main')
const showPage = document.querySelector('.showNumberPage')
const warnData = document.querySelector('.warn-data')
const searchKey = document.querySelector(".search__icon")
const inputSearch = document.querySelector(".search__input");
const inputfullName = document.querySelector(".staff__fullName");
const inputNumber = document.querySelector(".staff__number");
const inputEmail = document.querySelector(".staff__email");
const selectedJob = document.querySelector(".staff__job");
const selectedPerpage = document.querySelector(".pagination__record");
// const input = document.getElementById("search-input");
const sortaz = document.querySelector(".select__az");
const sortza = document.querySelector(".select__za");
const btnRight = document.querySelector('.btn-right')
const btnLeft = document.querySelector('.btn-left')
let addEmployees = [...EMPLOYEES];
let searchEmployees = [];
// phân trang
let perPage = Number(selectedPerpage.options[selectedPerpage.selectedIndex].text);
let currentPage = 1;
let start = 0;
let end = perPage;
let statusList = false; // trạng thái false: list add, true: list search

selectedPerpage.addEventListener("change", function (e) {
    perPage = Number(selectedPerpage.options[selectedPerpage.selectedIndex].text);
    if (!statusList) {
        initPagination();
        showList(addEmployees)
    } else {
        initPagination();
        showList(searchEmployees)
    }
})
document.querySelector(".btn-addstaff").addEventListener("click", () => {
    document.getElementById("staff__warn").innerHTML = "";
})
inputfullName.addEventListener("input", function (e) {
    // e.preventDefault();
    let name = inputfullName.value;
    inputNumber.value = handleId(addEmployees);
    inputEmail.value = handleEmail(name);
    document.getElementById("staff__warn").innerHTML = "";
})
inputfullName.addEventListener('keydown', function (e) {
    document.getElementById("staff__warn").innerHTML = "";
    if (e.key == "Enter") {
        addStaff();
    }
});

inputSearch.addEventListener("keydown", debounce(searchStaff, 400));

btnLeft.addEventListener('click', () => {
    currentPage--;
    if (currentPage <= 1) {
        currentPage = 1;
    }
    start = (currentPage - 1) * perPage;
    end = currentPage * perPage;
    if (statusList) showList(searchEmployees)
    else showList(addEmployees)
})

btnRight.addEventListener('click', () => {
    currentPage++;
    if (statusList) {
        let totalPage = gettotalPages(searchEmployees)
        if (currentPage > totalPage) {
            currentPage = checklastPage(searchEmployees) ? totalPage + 1 : totalPage;
        }
        start = (currentPage - 1) * perPage;
        end = currentPage * perPage;
        showList(searchEmployees)
    } else {
        let totalPage = gettotalPages(addEmployees)
        if (currentPage > totalPage) {
            currentPage = checklastPage(addEmployees) ? totalPage + 1 : totalPage;
        }
        start = (currentPage - 1) * perPage;
        end = currentPage * perPage;
        showList(addEmployees)
    }
})

function initPagination() {
    currentPage = 1;
    start = 0;
    end = perPage;
}

function initInput() {
    inputNumber.value = "";
    inputEmail.value = "";
    inputfullName.value = "";
}

function gettotalPages(list) {
    return Math.ceil(list.length / perPage)
}

function checklastPage(list) {
    if (list.length - (Math.floor(list.length / perPage) * perPage) > 0) return true;
    return false;
}

function lastCharName(s) {
    s = s.replace(/\s/g, ' ')
    s = s.replace(/\d+/g, ' ')
    s = s.trim().toLowerCase();
    let arr = s.split(" ");
    let result = arr[arr.length - 1].charAt(0).toUpperCase();
    return result;
}

// function getLastName(name) {
//     let fullName = name.split(' ');
//     let lastName = fullName[fullName.length - 1];
//     return lastName;
// }

function stringNormalization(s) {
    s = s.replace(/\s+/g, ' ');
    s = s.trim().toLowerCase();
    let arr = s.split(" ");
    let result = "";
    arr.forEach(el => {
        result += el.slice(0, 1).toUpperCase() + el.substring(1) + ' ';
    })
    return result;
}

function removeVietnameseTones(name) {
    let fullName = name.normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '').replace(/đ/gi, 'd')
        .toLowerCase().trim();
    return fullName;
}

function sortNumber(a, b) {
    return a > b ? 1 : -1;
}

function handleId(list) {
    return Math.max(...list.map(el => el.id)) + 1;
}

function handleEmail(name) {
    let listEmailEmployee = [];
    addEmployees.forEach(employee => {
        listEmailEmployee.push(JSON.parse(JSON.stringify(employee.email)));
    })
    let fullName = removeVietnameseTones(name).split(' ');
    let addressEmail; // email đầu ra
    if (fullName.length === 1) { // xử lý email có tên 1 từ
        addressEmail = fullName[0];
    } else { // xử lý email có tên n từ
        let firstName = fullName[0];
        let lastName = fullName[fullName.length - 1];
        addressEmail = `${lastName}.${firstName}`; //hong.nguyen
    }
    let check = false;
    let firstEmail = []; // tri so 2 3 4
    listEmailEmployee.forEach(email => {
        let femail = email.split('@')[0]
        if ((Number(femail.slice(addressEmail.length, femail.length).toString()) || femail.slice(addressEmail.length, femail.length).toString() === "") && (femail.slice(0, addressEmail.length) === addressEmail)) {
            if (femail === addressEmail) firstEmail.push(Number(1));
            else {
                let numberStaff = femail.slice(addressEmail.length, femail.length).toString();
                firstEmail.push(Number(numberStaff));
            }
            check = true;
        }
    })
    addressEmail = (check) ? `${addressEmail}${Math.max(...firstEmail) + 1}@ntq-solution.com.vn` : `${addressEmail}@ntq-solution.com.vn`;
    return addressEmail;
}

function handleName(userEnterfullName) {
    let checkName = false;
    let numberName = [];
    addEmployees.forEach(employee => {
        if (employee.name.slice(0, userEnterfullName.length).toString() === userEnterfullName && (Number(employee.name.slice(userEnterfullName.length + 1, employee.name.length).toString()) || (employee.name.slice(userEnterfullName.length, employee.name.length).toString() === ""))) {
            if (employee.name === userEnterfullName) numberName.push(Number(1));
            else {
                let numberStaff = Number(employee.name.slice(userEnterfullName.length + 1, employee.name.length).toString())
                numberName.push(Number(numberStaff));
            }
            checkName = true;
        }
    })
    userEnterfullName = (checkName) ? `${userEnterfullName} ${Math.max(...numberName) + 1}` : `${userEnterfullName}`;
    return userEnterfullName;
}
// show list
const showList = (listEmployee) => {
    const getData = listEmployee.map((item, index) => {
        if (index >= start && index < end) {
            if (end > listEmployee.length) end = listEmployee.length;
            showPage.innerHTML = `${start+1}-${end}/${listEmployee.length}`
            btnRight.disabled = (end === listEmployee.length) ? true : false;
            btnRight.style.cursor = (end === listEmployee.length) ? "not-allowed" : "pointer";
            btnLeft.disabled = (start === 0) ? true : false;
            btnLeft.style.cursor = (start === 0) ? "not-allowed" : "pointer";
            return `<div class="staff__detail">
                <div class="staff__detail-left">
                    <div class="staff-avatar">
                        <p class="char-avatar">${lastCharName(item.name)}</p>
                    </div>
                    <div class="staff-contact">
                        <i class="fa-regular fa-comments"> 16</i>
                        <i class="fa-solid fa-user-group">12</i>
                    </div> 
                </div>
                <div class="staff__detail-right">
                    <div class="staff__name">${item.name}</div>
                    <div class="staff__job">${item.job}</div>
                    <div class="staff__email">${item.email}</div>
                    <div class="btn-follow">
                        <button>Follow</button>
                    </div>
                </div>
            </div>`
        }
    }).join('')
    employees_list.innerHTML = getData;
}

showList(EMPLOYEES)
// add staff ===========================================================================================================

const addButton = document.querySelector(".btn-add")
const addStaff = () => {
    initPagination();
    statusList = false;
    inputSearch.value = "";
    let userEnterfullName = stringNormalization(inputfullName.value).trim();
    const jobStaff = selectedJob.options[selectedJob.selectedIndex].text;
    // validate
    const test = userEnterfullName.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
    console.log(test);
    if (userEnterfullName === "") {
        document.getElementById("staff__warn").innerHTML = "Nhập đầy đủ dữ liệu";
    } else if (Number(userEnterfullName.match(/\d+/)) || test.length < userEnterfullName.length) {
        document.getElementById("staff__warn").innerHTML = "Tên không chứa số hoặc kí tự đặc biệt";
    } else {
        document.getElementById("staff__warn").innerHTML = "";
        const idStaff = handleId(addEmployees);
        const nameStaff = handleName(userEnterfullName);
        const emailStaff = handleEmail(userEnterfullName);
        const staff = {
            id: idStaff,
            name: nameStaff,
            email: emailStaff,
            job: jobStaff
        }
        addEmployees.unshift(staff);
        showList(addEmployees);
    }
    initInput();
}
addButton.addEventListener('click', addStaff)


// function addStaff() {
//     console.log("ok");
//     initPagination();
//     statusList = false;
//     inputSearch.value = "";
//     let userEnterfullName = stringNormalization(inputfullName.value).trim();
//     const jobStaff = selectedJob.options[selectedJob.selectedIndex].text;
//     // validate
//     const test = userEnterfullName.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
//     console.log(test);
//     if (userEnterfullName === "") {
//         document.getElementById("staff__warn").innerHTML = "Nhập đầy đủ dữ liệu";
//     } else if (Number(userEnterfullName.match(/\d+/)) || test.length < userEnterfullName.length) {
//         document.getElementById("staff__warn").innerHTML = "Tên không chứa số hoặc kí tự đặc biệt";
//     } else {
//         document.getElementById("staff__warn").innerHTML = "";
//         const idStaff = handleId(addEmployees);
//         const nameStaff = handleName(userEnterfullName);
//         const emailStaff = handleEmail(userEnterfullName);
//         const staff = {
//             id: idStaff,
//             name: nameStaff,
//             email: emailStaff,
//             job: jobStaff
//         }
//         addEmployees.unshift(staff);
//         showList(addEmployees);
//     }
//     initInput();
// }
// search ===========================================================================================================

function searchStaff() {
    statusList = true;
    initPagination();
    // e.preventDefault();
    let userEnterKey = inputSearch.value;
    if (userEnterKey != "") {
        let listEmployee = JSON.parse(JSON.stringify(addEmployees));
        let listSearch = [];
        listEmployee.forEach(employee => {
            // tách tên ra khỏi họ tên và so sánh
            let fullName = employee.name.split(' ');
            let lastName = fullName[fullName.length - 1].toLowerCase();
            // tách email => 2 phần và so sánh
            let nameE = removeVietnameseTones(JSON.stringify(employee.name).toLowerCase());
            let emailE = JSON.stringify(employee.email);
            let jobE = JSON.stringify(employee.job).toLowerCase();
            userEnterKey = removeVietnameseTones(stringNormalization(userEnterKey).toLowerCase().trim());
            emailE = emailE.split('@');
            let usernameEmail = emailE[0];
            if (lastName === userEnterKey ||
                nameE.includes(userEnterKey) ||
                emailE === userEnterKey ||
                usernameEmail.includes(userEnterKey) ||
                jobE.includes(userEnterKey)
            ) {
                listSearch.push(employee);
            }
        });
        searchEmployees = [...listSearch];
        showList(searchEmployees);
    } else {
        statusList = false;
        showList(addEmployees);
    }
}


// sort staff ===========================================================================================================
sortaz.addEventListener("click", function (e) {
    initPagination();
    if (!statusList) {
        addEmployees.sort((a, b) => lastCharName(a.name).localeCompare(lastCharName(b.name)));
        showList(addEmployees)
    } else {
        searchEmployees.sort((a, b) => lastCharName(a.name).localeCompare(lastCharName(b.name)));
        showList(searchEmployees)
    }

})
sortza.addEventListener("click", function (e) {
    initPagination();
    if (!statusList) {
        addEmployees.sort((a, b) => lastCharName(b.name).localeCompare(lastCharName(a.name)));
        showList(addEmployees)
    } else {
        searchEmployees.sort((a, b) => lastCharName(b.name).localeCompare(lastCharName(a.name)));
        showList(searchEmployees)
    }
})
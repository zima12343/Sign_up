let isCorrectUnp = false;

function SignUpDto(unp, fullName, shortName, typeUnp, ownershipForm, date) {
    this.unp = unp,
        this.fullName = fullName,
        this.shortName = shortName,
        this.typeUnp = typeUnp,
        this.ownershipForm = ownershipForm,
        this.date = date
}

function getCheckedValue(radios) {
    for(item of radios) {
        if(item.checked) {
            return item.value;
        }
    }
}

async function SetUnpInfo(unp) {
    const fullName = document.getElementById('unp_name_text');
    const shortName = document.getElementById('unp_small_name_text');
    const i = document.querySelector('.form-input i');

    if(unp.toString().length != 9) {
        isCorrectUnp = false;
        fullName.value = "";
        shortName.value = "";
        i.style.display = 'none';
        return;
    }
    const url = `http://grp.nalog.gov.by/api/grp-public/data?unp=${unp}&charset=UTF-8&type=json`;
    let response = await fetch(url);

    if(response.status != 200) {
        isCorrectUnp = false;
        fullName.value = "";
        shortName.value = "";
        i.style.display = 'none';
        return;
    }

    response = await response.json();
    isCorrectUnp = true;

    result = response.row;

    
    fullName.value = result['vnaimp'];
    fullName.style.height = 'auto';
    fullName.style.height = (fullName.scrollHeight + 2) + 'px'
    shortName.value = result.vnaimk;

   
}

function formSubmit() {
    const unp = document.getElementById('unp_text');
    const fullName = document.getElementById('unp_name_text');
    const shortName = document.getElementById('unp_small_name_text');
    const typeUnp = document.getElementById('unp_type_text');
    const ownreshipForm = getCheckedValue(document.getElementsByName('ownership_form_radio'));
    const date = document.getElementById('date_signing_text');


    if(!isCorrectUnp) {
        if(!document.getElementById('unp_error')) {
            const unpError = document.createElement('span');
            unpError.className = 'unp_error';
            unpError.append(document.createTextNode('Неверный УНП'));
            unpError.style.color = '#EE1F12'
            unp.after(unpError);
            unp.style.borderColor = '#EE1F12'
        }
    }

    const result = new SignUpDto(unp.value, fullName.value, shortName.value,typeUnp.value, ownreshipForm, date.value);
}

function init() {
    const nextBtn = document.getElementById('next_btn');
    const unp = document.getElementById('unp_text');
    unp.addEventListener('focusout',async (e) => {
        await SetUnpInfo(e.target.value);
    });

    unp.addEventListener('input', function() {
        this.value = this.value.replace(/\D/g, '');
    });

    nextBtn.addEventListener('click', formSubmit)
}

document.addEventListener('DOMContentLoaded', init)
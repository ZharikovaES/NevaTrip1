const excursionSchedule = [...document.querySelectorAll(".advantages-excursion__list-item--schedule")];
const excursionTimeList = document.querySelectorAll(".excursion-time__list");
const excursionTime = [ ...excursionTimeList ];
const timeArr = excursionTime.map(el => el.querySelectorAll(".excursion-time__list-item"));

const width1 = 1000;

function load() {
    window.addEventListener('resize', () => {
        const widthWindow = Math.max(window.innerWidth, document.documentElement.clientWidth, document.body.clientWidth, 0);
        if (excursionSchedule && excursionTimeList && excursionTime && timeArr && widthWindow >= width1) 
            moreBtnsOfExcursions();
    });

    if (document.documentElement.clientWidth >= width1) moreBtnsOfExcursions();
    
    document.body.classList.remove("preload");
}

// функционирование кнопок "еще"
function moreBtnsOfExcursions() {
    if (excursionSchedule && excursionTimeList && excursionTime && timeArr) {
        const btn = document.createElement("button");
        btn.innerText = "еще...";
        btn.classList.add("excursion-time__link");
    
        const li = document.createElement("li");
        li.classList.add("excursion-time__list-item");
    
    
        // проход по кажой карточке, по каждому расписанию
        excursionSchedule.forEach((el, index) => {
            const style = el.currentStyle || window.getComputedStyle(el);
            const paddingLeft = parseFloat(style.paddingLeft);
    
            // вычисление ширины части блока с доступным временем, выходящего за пределы пункта списка преимуществ экскурсии
            let differenceWidth = paddingLeft + 6 + excursionTime[index].offsetWidth + el.querySelector("span").offsetWidth - el.clientWidth;
    
            if (differenceWidth > 0) {
                // создание кнопки "еще..."
                const cloneBtn = btn.cloneNode();
                const cloneLi = li.cloneNode();
    
                cloneBtn.innerText = "еще...";
                cloneLi.appendChild(cloneBtn);
                excursionTime[index].append(cloneLi);
    
                const style = excursionTimeList[index].currentStyle || window.getComputedStyle(excursionTimeList[index]);
                differenceWidth += excursionTime[index].lastChild.offsetWidth + parseFloat(style.gap);
    
                // получение массива блоков со временем, которые должны быть скрыты
                const res = [...timeArr[index]].reverse().reduce((acc, el) => {
                    const currentSumWidth = el.offsetWidth + parseFloat(style.gap);
                    if (differenceWidth > 0) {
                        differenceWidth -= currentSumWidth;
                        el.remove();
                        return [el, ...acc];
                    }
                    return acc;
                }, []);
    
                // обработка события клика на кнопку "еще"
                cloneBtn.addEventListener("click", e => {
                    el.querySelector(".excursion-time__list").append(...res);
                    cloneBtn.parentNode.remove();
                    excursionTime[index].classList.add("visible");
                });
            }
    
        });
    }
}

window.addEventListener("load", load);
const excursionSchedule = [...document.querySelectorAll(".advantages-excursion__list-item--schedule")];
const excursionTimeList = document.querySelectorAll(".excursion-time__list");
const excursionTime = [ ...excursionTimeList ];
const timeArr = excursionTime.map(el => el.querySelectorAll(".excursion-time__list-item"));

const hiddenElements = [];
const width1 = 1000;

function load() {
    window.addEventListener('resize', () => {
        const widthWindow = Math.max(window.innerWidth, document.documentElement.clientWidth, document.body.clientWidth, 0);
        if (excursionSchedule && excursionTimeList && excursionTime && timeArr) 
            moreBtnsOfExcursions(widthWindow);
    });

    const currentWindowWidth = Math.max(window.innerWidth, document.documentElement.clientWidth, document.body.clientWidth, 0);
    moreBtnsOfExcursions(currentWindowWidth);
    
    document.body.classList.remove("preload");
}

// функционирование кнопок "еще"
function moreBtnsOfExcursions(widthWindow) {
    if (excursionSchedule && excursionTimeList && excursionTime && timeArr) {
        const btn = document.createElement("button");
        btn.innerText = "еще...";
        btn.setAttribute('aria-expanded', false);
        btn.classList.add("excursion-time__link");
    
        const li = document.createElement("li");
        li.classList.add("excursion-time__list-item");
        
        // проход по кажой карточке, по каждому расписанию
        excursionSchedule.forEach((el, index) => {
            const style = el.currentStyle || window.getComputedStyle(el);
            const paddingLeft = parseFloat(style.paddingLeft);

            // возвращение скрытых элементов
            if (hiddenElements[index]?.length) {
                excursionTime[index].append(...hiddenElements[index]);
                hiddenElements[index] = undefined;
            }

            // удаление имеющихся кнопок "еще..."
            const currentBtnMore = el.querySelector('#btn-more');
            if (currentBtnMore) currentBtnMore.remove();

            // создание кнопки "еще..."
            const cloneBtn = btn.cloneNode();
            const cloneLi = li.cloneNode();

            cloneBtn.innerText = "еще...";
            cloneBtn.setAttribute('aria-controls', `excursion-time-list-${index + 1}`);
            cloneBtn.setAttribute('aria-expanded', true);
            cloneLi.setAttribute("id", "btn-more");
            cloneLi.appendChild(cloneBtn);
            
            
            if (widthWindow > width1) {
                // вычисление ширины части блока с доступным временем, выходящего за пределы пункта списка преимуществ экскурсии
                let differenceWidth = paddingLeft + 4 + excursionTime[index].offsetWidth + el.querySelector("span").offsetWidth - el.clientWidth;
                if (differenceWidth > 0) {
                    excursionTime[index].append(cloneLi);
        
                    const style = excursionTimeList[index].currentStyle || window.getComputedStyle(excursionTimeList[index]);
                    differenceWidth += excursionTime[index].lastChild.offsetWidth + parseFloat(style.gap);
        
                    // получение массива блоков со временем, которые должны быть скрыты (элементы, которые выдвигаются за пределы родителя, и последний нескрытый элемент, вместо которого добавляется кнопка "еще")
                    const res = [...timeArr[index]].reverse().reduce((acc, el) => {
                        const currentSumWidth = el.offsetWidth + parseFloat(style.gap);
                        if (differenceWidth > 0) {
                            differenceWidth -= currentSumWidth;
                            el.remove();
                            return [el, ...acc];
                        }
                        return acc;
                    }, []);
                    
                    hiddenElements[index] = res;
                }
            } else if (timeArr[index].length && excursionTimeList[index].offsetHeight > timeArr[index]?.[0]?.offsetHeight) {
                excursionTime[index].append(cloneLi);

                let flag = true;
                
                // получение массива блоков со временем, которые должны быть скрыты (скрываются элементы, которые переносятся на новую строку, и последний нескрытый элемент, вместо которого добавляется кнопка "еще")
                const res = [...timeArr[index]].reverse().reduce((acc, el) => {
                    if ((excursionTimeList[index].offsetHeight > timeArr[index][0].offsetHeight && flag) || (excursionTimeList[index].offsetHeight <= timeArr[index][0].offsetHeight && !flag)) {
                        el.remove();
                        if (excursionTimeList[index].offsetHeight <= timeArr[index][0].offsetHeight && flag) flag = false;
                        else flag = true;
                        return [el, ...acc];
                    }
                    return acc;
                }, []);

                hiddenElements[index] = res;
            }
            
            // обработка события клика на кнопку "еще"
            cloneBtn.addEventListener("click", e => {
                if (hiddenElements[index]?.length) el.querySelector(".excursion-time__list").append(...hiddenElements[index]);
                hiddenElements[index] = undefined;
                cloneBtn.parentNode.remove();
                excursionTime[index].classList.add("visible");
            });
        });
    }
}

window.addEventListener("load", load);
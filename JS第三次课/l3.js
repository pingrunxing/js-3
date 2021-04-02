var data = [];
var $ = function (id) {
    return document.getElementById(id);
}
$('widget').addEventListener('click', e => {
    // 获取输入的数据
    let input = Number($('input-data').value.trim());

    switch (e.target.id) {
        case "btn-left-push":
            // 检测输入，如果输入不合法则break
            if (!checkInput(input)) break;
            // 如果输入的数据超过50则break
            if (data.length > 20) {
                alert('队列已满，无法继续添加数据！')
                break;
            }
            // 向左插入元素
            data.unshift(input);
            $('input-data').value = '';

            // 重新渲染div-queue
            render();

            break;
        case "btn-right-push":
            if (!checkInput(input)) break;
            if (data.length > 20) {
                alert('队列已满，无法继续添加数据！')
                break;
            }
            data.push(input);
            $('input-data').value = '';

            render();

            break;
        case "btn-left-pop":
            if (data.length == 0) {
                alert('队列为空，无法弹出数据！');
                break;
            }
            alert(data.shift());
            render();

            break;
        case "btn-right-pop":
            if (data.length == 0) {
                alert('队列为空，无法弹出数据！');
                break;
            }
            alert(data.pop());
            render();
            break;
        case "btn-sort":
            let i = data.length - 1,
                j = 1,
                timer = null;

            let inerval = $('input-interval').value;
            timer = setInterval(() => {
                if (i >= 0) {
                    if (j <= i) {
                        
                        if (data[j - 1] > data[j]) {
                            [data[j], data[j - 1]] = [data[j - 1], data[j]];
                            render(j - 1, j);
                        }
                        j++;
                    } else {
                        i--;
                        j = 1;
                    }
                } else {
                    clearInterval(timer);
                }
            }, inerval);

            break;
        case "btn-random":
            for (let i = 0; i < 20; i++) {
                data[i] = Math.round(Math.random() * 200 + 100);
            }
            render();
            break;
    }
});

function render(...arr) {

    if (arr.length != 0) {
        // 先获取两个待交换的元素
        let element1 = $(`${ arr[0] }`);
        let element2 = $(`${ arr[1] }`);

        element1.style.background = 'black';
        element2.style.background = 'black';

        setTimeout(() => {
            element1.style.background = 'red';
            element2.style.background = 'red';
        }, Number($('input-interval').value) * 2);

        // 同时设置高度变化的动画
        transform(element1, 'height', data[arr[0]] * 2, (Number($('input-interval').value) / 2) - 5, 5);
        transform(element2, 'height', data[arr[1]] * 2, (Number($('input-interval').value) / 2) - 5, 5);

    } else {
        let content = '';
        for (let i = 0; i < data.length; i++) {
            content += `<div id="${ i }", style="height:${ data[i] * 2 }px;"></div>`
        }
        $('div-queue').innerHTML = content;
    }
}

function checkInput(input) {
    if (isNaN(input) || input < 10 || input > 100) {
        alert('请输入10-100的数据');
        $('input-data').value = '';
        return false;
    }
    return true;
}

function transform(obj, attr, targetStatus, interval, speed, callback = () => {}) {


    // 如果第一次为这个元素开启定时器
    if (obj.animation == undefined) obj.animation = {};

    if (obj.animation[attr] == undefined) {
        obj.animation[attr] = {};

        obj.animation[attr].target = targetStatus;
        obj.animation[attr].timer = setInterval(() => {
   
            let currentValue = parseInt(getComputedStyle(obj)[attr]);
 
            if (speed > 0 && currentValue > targetStatus) speed = -speed;

            // 更新属性取值
            let newValue = currentValue + speed;


            if ((speed < 0 && newValue < targetStatus) || (speed > 0 && newValue > targetStatus)) {
                newValue = targetStatus;
            }

            obj.style[attr] = newValue + 'px';
            if (currentValue === targetStatus) {
                clearInterval(obj.animation[attr].timer);

                // 删除定时器中的相关属性
                delete obj.animation[attr];
                // 动画执行完毕后执行回调函数
                callback();
            }
        }, interval)
    } else {


        if (targetStatus != obj.animation[attr].target) {

            // 开一个定时器，每隔 10ms 来判断上一个同类动画是否执行完
            let tempTimer = setInterval(() => {

                // 如果属性已经不存在animation对象中，说明已经执行完该动画
                if (!(attr in obj.animation)) {
                    // 开启新动画
                    transform(obj, attr, targetStatus, interval, speed, callback);


                    clearInterval(tempTimer);
                    tempTimer = null;
                }
            }, 10);
        }
    }
}
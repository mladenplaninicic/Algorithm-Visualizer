let model = (function () {
    let _array = [];
    let _colors = [];
    let _animations = [];

    let maxRange = window.innerHeight - 150;

    let initParameters = {
        maxRange: maxRange,
        minRange: 30,
        arrayLength: 0
    }

    let colorParameters = {
        DEFAULT_COLOR: '',
        COMPARE_COLOR: '',
        SWAP_COLOR: ''
    }

    let getRandomInt = function () {
        return Math.floor(Math.random() * (initParameters.maxRange - initParameters.minRange + 1)) + initParameters.minRange;
    }

    let compare = function (i, j) {
        _animations.push(['compare', i, j]);
    }

    let swap = function (i, j) {
        _animations.push(['swap', i, j]);
    }

    let swapForMergeSort = function (i, j) {
        _animations.push(['swapForMergeSort', i, j]);
    }

    let done = function (x) {
        _animations.push(['done', x]);
    }

    let doneLinear = function (x) {
        _animations.push(['doneLinear', x]);
    }

    let swapNumbers = function (arr, i, j) {
        var temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }

    let partition = function (arr, low, high) {
        var pivot = arr[high];
        var i = low - 1;
        for (var j = low; j < arr.length - 1; j++) {
            compare(j, high);
            if (arr[j] < pivot) {
                i++;

                swapNumbers(arr, i, j);

                if (i != j) {
                    swap(i, j);
                }
            }
        }
        var temp = arr[i + 1];
        arr[i + 1] = pivot;
        arr[high] = temp;
        swap(i + 1, high);

        return i + 1;
    }

    let quickSort = function (arr, low, high) {
        if (low < high) {
            var p = partition(arr, low, high);

            quickSort(arr, low, p - 1);
            quickSort(arr, p + 1, high);
        }
    }

    function getMergeSortAnimations(array) {
        const animations = [];
        if (array.length <= 1) return array;
        const auxiliaryArray = array.slice();
        mergeSortHelper(array, 0, array.length - 1, auxiliaryArray, animations);
        return animations;
    }

    function mergeSortHelper(
        mainArray,
        startIdx,
        endIdx,
        auxiliaryArray,
        animations,
    ) {
        if (startIdx === endIdx) return;
        const middleIdx = Math.floor((startIdx + endIdx) / 2);
        mergeSortHelper(auxiliaryArray, startIdx, middleIdx, mainArray, animations);
        mergeSortHelper(auxiliaryArray, middleIdx + 1, endIdx, mainArray, animations);
        doMerge(mainArray, startIdx, middleIdx, endIdx, auxiliaryArray, animations);
    }

    function doMerge(
        mainArray,
        startIdx,
        middleIdx,
        endIdx,
        auxiliaryArray,
        animations,
    ) {
        let k = startIdx;
        let i = startIdx;
        let j = middleIdx + 1;
        while (i <= middleIdx && j <= endIdx) {
            compare(i, j);
            if (auxiliaryArray[i] <= auxiliaryArray[j]) {
                swapForMergeSort(k, auxiliaryArray[i]);
                mainArray[k++] = auxiliaryArray[i++];
            } else {
                swapForMergeSort(k, auxiliaryArray[j]);
                mainArray[k++] = auxiliaryArray[j++];
            }
        }
        while (i <= middleIdx) {
            swapForMergeSort(k, auxiliaryArray[i]);
            mainArray[k++] = auxiliaryArray[i++];
        }
        while (j <= endIdx) {
            swapForMergeSort(k, auxiliaryArray[j]);
            mainArray[k++] = auxiliaryArray[j++];
        }
    }

    return {
        generateArray: function () {
            for (let i = 0; i < initParameters.arrayLength; i++) {
                let num = getRandomInt();
                _array.push(num);
                _colors.push(colorParameters.DEFAULT_COLOR);
            }
        },

        bubbleSort: function (array) {
            for (let i = 0; i < array.length; i++) {
                for (let j = 0; j < array.length - 1 - i; j++) {
                    compare(j, j + 1);
                    if (array[j] > array[j + 1]) {
                        swap(j, j + 1);
                        swapNumbers(array, j, j + 1);
                    }
                }
                done(array.length - 1 - i);
            }
        },

        selectionSort: function (array) {
            for (let i = 0; i < array.length; i++) {
                let minIndex = i;
                for (let j = i + 1; j < array.length; j++) {
                    compare(j, minIndex);
                    if (array[j] < array[minIndex]) {
                        minIndex = j;
                    }
                }
                swap(i, minIndex);
                swapNumbers(array, i, minIndex);
                done(i);
            }
        },

        insertionSort: function (array) {
            for (let i = 1; i < array.length; i++) {
                let el = array[i];
                let j = i - 1;

                compare(i, j);
                while (el < array[j] && j >= 0) {
                    swap(j + 1, j);
                    array[j + 1] = array[j];
                    j--;
                }
                array[j + 1] = el;
            }
            doneLinear(0);
        },

        quickSortCall: function (arr, low, high, temp) {
            quickSort(arr, low, high, temp);
            doneLinear(0);
        },

        mergeSortCall: function (arr) {
            getMergeSortAnimations(arr);
            doneLinear(0);
        },

        setInitParameters: function (init) {
            initParameters.arrayLength = init.arrayLength;
        },

        setColors: function (colors) {
            colorParameters.DEFAULT_COLOR = colors.DEFAULT_COLOR;
            colorParameters.COMPARE_COLOR = colors.COMPARE_COLOR;
            colorParameters.SWAP_COLOR = colors.SWAP_COLOR;
        },

        getArray: function () {
            return _array;
        },

        getColorsArray: function () {
            return _colors;
        },

        getAnimationsArray: function () {
            return _animations;
        },

        resetModel: function(){
            _array = [];
            _colors = [];
            _animations = [];
        }

    }
})();

let view = (function () {
    let _DEFAULT_COLOR = '#5EA6EE';
    let _COMPARE_COLOR = '#F53D3D'; 
    let _SWAP_COLOR = '#3FB641'; //#008543
    let _DONE_COLOR = '#0D4A97';

    let interval;

    changeColor = function (x, color) {
        document.getElementById(`${x}`).style.backgroundColor = color;
    }

    changeColors = function (i, j, color) {
        document.getElementById(`${i}`).style.backgroundColor = color;
        document.getElementById(`${j}`).style.backgroundColor = color;
    }

    getElementHeight = function (element) {
        return document.getElementById(`${element}`).style.height;
    }

    setElementHeight = function (element, height) {
        document.getElementById(`${element}`).style.height = height;
    }

    setElementInnerText = function (element, text) {
        document.getElementById(`${element}`).innerText = text;
    }

    return {
        drawArray: function (array, colors) {
            for (let i = 0; i < array.length; i++) {
                let el = array[i];
                let html = `<div class="sort" id="${i}" style="height: ${el}px">${el}</div>`;
                document.querySelector('.wrapper').insertAdjacentHTML('beforeend', html);
                changeColor(i, colors[i]);
            }
        },

        animate: function (animations, array) {
            let firstItem = animations.shift();
            let action = firstItem[0];

            let i = firstItem[1];
            let j = firstItem[2];

            if (action === 'swapForMergeSort') {
                let px = j + 'px';
                setElementHeight(i, px);

                if(array.length <= 18){
                    setElementInnerText(i, j);
                }
                
                return;
            }

            let tempI = document.getElementById(`${i}`).style.backgroundColor;
            let tempJ;
            if (j != null) {
                tempJ = document.getElementById(`${j}`).style.backgroundColor;
            }

            if (tempI !== _DONE_COLOR) {
                tempI = false;
            }
            if (tempJ !== _DONE_COLOR) {
                tempJ = false;
            }

            if (action === 'compare') {
                changeColors(i, j, _COMPARE_COLOR);
            }

            if (action === 'swap') {
                changeColors(i, j, _SWAP_COLOR);
                let valueForIinPixels = getElementHeight(i);
                let valueForJinPixels = getElementHeight(j);

                let len = valueForIinPixels.length;
                let valueForIforDisplay = valueForIinPixels.substring(0, len - 2);

                len = valueForJinPixels.length;
                let valueForJforDisplay = valueForJinPixels.substring(0, len - 2);

                setElementHeight(i, valueForJinPixels);
                setElementHeight(j, valueForIinPixels);

                let widthPx = document.getElementById(j).style.width; 

                if(array.length <= 15 && widthPx > '30px'){
                    setElementInnerText(i, valueForJforDisplay);
                    setElementInnerText(j, valueForIforDisplay);
                }
            }
            if (action != 'done' && action != 'doneLinear') {
                setTimeout(() => {
                    changeColors(i, j, _DEFAULT_COLOR);
                }, interval / 2);
            } else {
                if (action === 'doneLinear') {
                    for (let i = 0; i < array.length; i++) {
                        changeColor(i, _DONE_COLOR);
                    }
                    return;

                }
                changeColor(i, _DONE_COLOR);
            }
        },

        setInitialParameters: function () {
            document.querySelector('.speedInputField').value = 200;
            document.querySelector('.arraySizeInputField').value = 10;
        },

        getParametersForAppInitialization: function () {
            interval = document.querySelector('.speedInputField').value;
            return {
                interval: document.querySelector('.speedInputField').value,
                arrayLength: document.querySelector('.arraySizeInputField').value
            }
        },

        getColors: function () {
            return {
                DEFAULT_COLOR: _DEFAULT_COLOR,
                COMPARE_COLOR: _COMPARE_COLOR,
                SWAP_COLOR: _SWAP_COLOR
            }
        },

        resetView: function(){
            document.querySelector('.wrapper').innerHTML = '';
        }
    }

})();

let controller = (function (model, view) {
    let array, colors, animations;
    let selectedAlgorithms = [];
    let initParameters = {
        interval: 0
    }
    // refactor
    validateInput = function(speed, arraySize){
        let result = true;

        if(speed < 10 || speed > 1000){
            if(speed < 10){
                document.querySelector('.speedValidation').innerText = 'Min speed is 10ms';
            }

            if(speed > 1000){
                document.querySelector('.speedValidation').innerText = 'Max speed is 1000ms';
            }
            result = false;
            document.querySelector('.speedInputField').style.border = '1.5px solid #F53D3D';
        }

        if(arraySize < 4 || arraySize > 120){
            if(arraySize < 4){
                document.querySelector('.arraySizeValidation').innerText = 'Min size is 4';
            }

            if(arraySize > 120){
                document.querySelector('.arraySizeValidation').innerText = 'Max size is 120';
            }
            result = false;
            document.querySelector('.arraySizeInputField').style.border = '1.5px solid #F53D3D';
        }
  
        if(!result){
            return result;
        }

        document.querySelector('.speedInputField').style.border = 'none';
        document.querySelector('.arraySizeInputField').style.border = 'none';
        document.querySelector('.speedValidation').innerText = '';
        document.querySelector('.arraySizeValidation').innerText = '';
        return true;
    }

    generateArrayHandler = function () {

        let initParams = view.getParametersForAppInitialization();
        let valid = validateInput(initParams.interval, initParams.arrayLength);

        if(!valid){
            return;
        }

        model.setInitParameters(initParams);
        initParameters.interval = initParams.interval;
        model.generateArray();
        array = model.getArray();
        colors = model.getColorsArray();

        let width = document.querySelector(".wrapper").offsetWidth;

        view.drawArray(array, colors);

        let bars = document.querySelectorAll('.sort');
        let widthPx = width / initParams.arrayLength / 2 + 'px';
        bars.forEach((item) => {
            item.style.width = widthPx;
            if(initParams.arrayLength > 15 || widthPx < '30px'){
                item.innerText = '';
            }
        });

    }

    initialization = function () {
        document.querySelector('.sortButton').setAttribute('disabled', 'true');
        document.querySelector('.sortButton').style.backgroundColor = 'transparent';
        document.querySelector('.sortButton').style.color = '#ECECEC';

        var styleElem = document.head.appendChild(document.createElement("style"));
        styleElem.innerHTML = ".btn.sortButton:before {background: #F53D3D;}";

        document.querySelector('.spinner').style.visibility = 'hidden';

        view.setInitialParameters();
        let colors = view.getColors();
        model.setColors(colors);
        generateArrayHandler();
    }

    setEventListeners = function () {
        document.querySelector('.algorithms').addEventListener('click', (e) => {

            if (selectedAlgorithms.length > 0) {
                selectedAlgorithms[0].classList.remove('selected');

                document.querySelector('.sortButton').removeAttribute('disabled');
                document.querySelector('.sortButton').style.backgroundColor = 'transparent';
                document.querySelector('.sortButton').style.color = '#ECECEC';

                var styleElem = document.head.appendChild(document.createElement("style"));
                styleElem.innerHTML = ".btn.sortButton:before {background: #5EA6EE;}";

                selectedAlgorithms.pop();
            }

            document.querySelector('.sortButton').removeAttribute('disabled');
            document.querySelector('.sortButton').style.backgroundColor = '#ECECEC';
            document.querySelector('.sortButton').style.color = 'black';

            var styleElem = document.head.appendChild(document.createElement("style"));
            styleElem.innerHTML = ".btn.sortButton:before {background: #5EA6EE;}";

            let el = e.target;
            el.classList.add('selected');
            selectedAlgorithms.push(el);
        });

        document.querySelector('.generateArray').addEventListener('click', () => {
            view.resetView();
            model.resetModel();
            generateArrayHandler();
        });

        document.querySelector('.sortButton').addEventListener('click', () => {
            let algorithm;
            let initParams = view.getParametersForAppInitialization();

            let valid = validateInput(initParams.interval, initParams.arrayLength);

            if(!valid){
                return;
            }

            document.querySelector('.spinner').style.visibility = 'visible';
            document.querySelector('.header').style.pointerEvents = 'none';

            model.setInitParameters(initParams);
            initParameters.interval = initParams.interval;

            if(selectedAlgorithms.length > 0){
                algorithm = selectedAlgorithms[0].innerText;
            }

            if(algorithm == 'Bubble Sort'){
                model.bubbleSort(array);
            } else if(algorithm == 'Selection Sort'){
                model.selectionSort(array);
            } else if(algorithm == 'Insertion Sort'){
                model.insertionSort(array);
            } else if(algorithm == 'Quick Sort'){
                model.quickSortCall(array, 0, array.length-1, array);
            } else if(algorithm == 'Merge Sort'){
                model.mergeSortCall(array);
            }

            animations = model.getAnimationsArray();
            startAnimating(animations, initParameters, array);

        });
    }

    function customClearInterval(interval) {
        clearInterval(interval);
    }

    startAnimating = function (animations, initParameters, array) {
        let interval = setInterval(() => {
            if (animations.length == 0) {
                customClearInterval(interval);
                document.querySelector('.spinner').style.visibility = 'hidden';
                document.querySelector('.header').style.pointerEvents = 'auto';
                document.querySelector('.header').setAttribute('readonly', 'true');
            } else {
                view.animate(animations, array);
            }
        }, initParameters.interval);
    }

    return {
        init: function () {
            initialization();
            setEventListeners();
        }
    }

})(model, view);

controller.init();

// TO DO
//
// 5. Code refactor and optimization
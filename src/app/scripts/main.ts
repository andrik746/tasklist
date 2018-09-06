//add prefixer
//rewrite var via this.varName?
import $ = require("jquery");

interface TasklistInterface{

}

class Tasklist implements TasklistInterface{
    $tasks: JQuery<HTMLElement>;
    $input: JQuery<HTMLInputElement>;
    $addButton: JQuery<HTMLElement>;
    id_code: string;
    constructor(id_name: string){
        let self = this;
        this.id_code = id_name;
        this.$tasks = $(this.id_code + ' .tasks');
        this.$input = $(this.id_code + ' .addInput');
        this.$addButton = $(this.id_code + ' .addButton');

        self.checkSavedTasks();
        self.addEvents();
    }
    /*--------------- Tasklist methods --------------------*/
    addItem(){
        let itemText: string = String( this.$input.val() );
        if( itemText == '' ) return;
        this.createListUtil(itemText)
        this.$input.val('');
        this.save();
    }
    updateList(data: {name: string, flag: boolean}[]){
        for(let value of data){
            let itemText: string = value.name;
            let flag = value.flag;
            this.createListUtil(itemText, flag)
        }
    }
    createListUtil(itemText: string, flag?: boolean){
        var $item: JQuery<HTMLElement> = $('<li/>', {class: 'task list-group-item'});
        var $spanText: JQuery<HTMLElement> = $('<p/>', {class: 'task-text'});
        var $doneButton: JQuery<HTMLElement> = $('<button/>', {class: 'done-button btn-stable-width btn btn-secondary'});
        var $removeButton: JQuery<HTMLElement> = $('<button/>', {class: 'remove-button btn btn-link'});
        var $upButton: JQuery<HTMLElement> = $('<button/>', {class: 'up-button btn btn-link'});
        var $downButton: JQuery<HTMLElement> = $('<button/>', {class: 'down-button btn btn-link'});
        $spanText.text(itemText);
        $doneButton.text('done');
        $removeButton.html('<svg xmlns="http://www.w3.org/2000/svg" width="12" height="16" viewBox="0 0 12 16"><path fill-rule="evenodd" d="M11 2H9c0-.55-.45-1-1-1H5c-.55 0-1 .45-1 1H2c-.55 0-1 .45-1 1v1c0 .55.45 1 1 1v9c0 .55.45 1 1 1h7c.55 0 1-.45 1-1V5c.55 0 1-.45 1-1V3c0-.55-.45-1-1-1zm-1 12H3V5h1v8h1V5h1v8h1V5h1v8h1V5h1v9zm1-10H2V3h9v1z"/></svg>');
        $upButton.html('<svg xmlns="http://www.w3.org/2000/svg" width="10" height="16" viewBox="0 0 10 16"><path fill-rule="evenodd" d="M10 10l-1.5 1.5L5 7.75 1.5 11.5 0 10l5-5 5 5z"/></svg>');
        $downButton.html('<svg xmlns="http://www.w3.org/2000/svg" width="10" height="16" viewBox="0 0 10 16"><path fill-rule="evenodd" d="M5 11L0 6l1.5-1.5L5 8.25 8.5 4.5 10 6l-5 5z"/></svg>');
        this.$tasks.append($item);
        $item.append($spanText);
        $item.append($doneButton);
        $item.append($removeButton);
        $item.append($upButton);
        $item.append($downButton);
        if(flag === true){
            $spanText.addClass('item-done');
            $doneButton.text('revisit');
            $doneButton.removeClass('done-button');
        }
    }
    removeItem(target: HTMLElement){
        if( !target.classList.contains('remove-button') ) return;
        if( !target.parentNode ) return;
        let grandParent = target.parentNode.parentNode;
        let parent = target.parentNode;
        if( !grandParent ) return;
        grandParent.removeChild(parent);
        this.save();
    }
    doneTask(target: HTMLElement){
        if( !target.classList.contains('done-button') ) return false;
        if( !target.previousElementSibling ) return false;
        target.previousElementSibling.classList.add('item-done');
        target.textContent = 'revisit';
        target.classList.remove('done-button');
        this.save();
        return true;
    }
    revisit(target: HTMLElement){
        if( !target.previousElementSibling ) return;
        if( !target.previousElementSibling.classList.contains('item-done') ) return;
        target.previousElementSibling.classList.remove('item-done');
        target.textContent = 'done';
        target.classList.add('done-button');
        this.save();
    }
    save(){
        let currentTasks: {name: string, flag: boolean}[] = [];
        this.$tasks.find('li').toArray().forEach(function(item){
            if(item.firstElementChild){
                let text = item.firstElementChild.textContent;  
                let checkStatus: boolean;
                if( item.firstElementChild.classList.contains('item-done') ){
                    checkStatus = true;  
                }else{
                    checkStatus = false;
                }
                if(text) currentTasks.push(
                    {
                        name: text,
                        flag: checkStatus
                    }
                );
            } 
        });
        let data = JSON.stringify(currentTasks);
        localStorage.setItem('userTasks', data);
    }
    checkSavedTasks(){
        if( localStorage.getItem('userTasks') ){
            let savedData: {name: string, flag: boolean}[] = JSON.parse( localStorage.getItem('userTasks') as string );
            this.updateList(savedData);
        }
    }
    moveUp(target: HTMLElement){
        if( !target.classList.contains('up-button') ) return;
        if ( !target.parentElement ) return;
        let listItem = target.parentElement;
        if( !listItem.previousElementSibling ) return;
        let prevBro = listItem.previousElementSibling;
        if ( !listItem.parentElement ) return;
        let grandParent = listItem.parentElement;
        grandParent.insertBefore(listItem, prevBro);
    }
    moveDown(target: HTMLElement){
        if( !target.classList.contains('down-button') ) return;
        if ( !target.parentElement ) return;
        let listItem = target.parentElement;
        if( !listItem.nextElementSibling ) return;
        let nextBro = listItem.nextElementSibling;

        if ( !listItem.parentElement ) return;
        let grandParent = listItem.parentElement;

        if ( !listItem.nextElementSibling.nextElementSibling ){
            grandParent.appendChild(listItem);
        }else{
            let secondNextBro = listItem.nextElementSibling.nextElementSibling
            grandParent.insertBefore(listItem, secondNextBro);
        }
    }
    addEvents(){
        let self = this;
        this.$addButton.on('click', function(e){
            e.preventDefault();
            self.addItem();
        });
        this.$input.on('submit', function(e){
            e.preventDefault();
            self.addItem();
        });
        document.addEventListener('click', function(e){
            e.preventDefault();
            self.removeItem(e.target as HTMLElement);
            if( !self.doneTask(e.target as HTMLElement) ){
                self.revisit(e.target as HTMLElement);
            }
            self.moveUp(e.target as HTMLElement);
            self.moveDown(e.target as HTMLElement);
        });
    }
}

let tasklist = new Tasklist('#main_list');
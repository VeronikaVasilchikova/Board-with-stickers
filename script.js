document.addEventListener('DOMContentLoaded', function () {

// Create empty array of objects
    let array = [];

// Choose the noteField and the button
    let btnPlus = document.querySelector('#plus');
    let noteField = document.querySelector('.noteField');

// Create a function renderAllTasks(noteList)
    function renderAllTasks(noteList) {
        const fragment = document.createDocumentFragment();
        Object.values(noteList).forEach(item => {
            const note = drawNote();
            note.style.background = item.bColor;
            note.style.left = item.left + 'px';
            note.style.top = item.top + 'px';
            note.setAttribute('data-note-id', item._id);
            note.children[0].style.background = item.bColor;
            note.children[0].style.borderColor = item.bColor;
            note.children[0].value = item.text;
            note.children[1].style.background = item.bColor;
            note.children[1].style.borderColor = item.bColor;
            note.children[2].style.background = item.bColor;
            note.children[2].style.borderColor = item.bColor;
            fragment.appendChild(note);
        });
        noteField.appendChild(fragment);
    }

// Create an object objOfNotes depending on the existing of information in localStorage
    let objOfNotes;

    if(localStorage.getItem('newArray')) {
        objOfNotes = JSON.parse(localStorage.getItem('newArray'));
        renderAllTasks(objOfNotes);
    } else {
        objOfNotes = array.reduce((acc, note) => {
            acc[note._id] = task;
            return acc;
        }, {});
    }

// Create a function randomInteger(min, max) to get random integer
    function randomInteger(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

// Create a function randColor() to get random rgb-color
    function randColor(){
        let r = randomInteger(250, 255);
        let g = randomInteger(150, 250);
        let b = randomInteger(200, 250);
        return "rgb("+r+","+g+","+b+")";
    }

// Create a function doMarkup(array) to draw note
    function drawNote(){
        let bColor = randColor();
        _id = Math.random().toFixed(3);

        let newDiv = document.createElement('div');
            newDiv.className = 'note';
            newDiv.style.background = bColor;
            newDiv.setAttribute('data-note-id', _id);
            newDiv.setAttribute('draggable', 'true');

        let newTextArea = document.createElement('textarea');
            newTextArea.style.background = bColor;
            newTextArea.style.borderColor = bColor;

        let btnOk = document.createElement('button');
            btnOk.className = 'save';
            btnOk.textContent = 'Save';
            btnOk.style.background = bColor;
            btnOk.style.borderColor = bColor;

        let btnDel = document.createElement('button');
            btnDel.className = 'delete';
            btnDel.style.background = bColor;
            btnDel.style.borderColor = bColor;
            btnDel.textContent = 'Del';

        newDiv.appendChild(newTextArea);
        newDiv.appendChild(btnOk);
        newDiv.appendChild(btnDel);

// Implement drag and drop features for notes
        newDiv.addEventListener('mousedown', (e) => {
            if(e.target.className === 'note') {

                let shiftX = e.clientX - newDiv.getBoundingClientRect().left;
                let shiftY = e.clientY - newDiv.getBoundingClientRect().top;

                newDiv.style.zIndex = 1000;
                noteField.append(newDiv);

                moveAt(e.pageX, e.pageY);

                function moveAt(pageX, pageY) {
                    newDiv.style.left = pageX - shiftX + 'px';
                    newDiv.style.top = pageY - shiftY + 'px';
                }

                function onMouseMove(e) {
                    moveAt(e.pageX, e.pageY);
                }

                noteField.addEventListener('mousemove', onMouseMove);

                newDiv.addEventListener('mouseup', () => {
                    noteField.removeEventListener('mousemove', onMouseMove);
                    newDiv.onmouseup = null;
                    let id = newDiv.dataset.noteId;
                    objOfNotes[`${id}`].left = newDiv.getBoundingClientRect().x;
                    objOfNotes[`${id}`].top = newDiv.getBoundingClientRect().y;
                    localStorage.setItem('newArray', JSON.stringify(objOfNotes));
                });
            }
        });

        // Remove default behavior for note dragstart event
        newDiv.ondragstart = function() {
            return false;
        };

        return newDiv;
    }

// Create a function createNewNote(text, left, top, bColor, _id) to create a note for objOfNotes
    function createNewNote(text, left, top, bColor, _id) {
        const newNote = {
          text,
          left,
          top,
          bColor,
          _id,
        }
        objOfNotes[newNote._id] = newNote;
        return { ...newNote };
    }

/*  Create a function which shows a confirmation window,
    removes note-item from objOfNotes,
    saves changes in localStorage
*/
    function deleteNote(id) {
        const isConfirm = confirm('Are you sure you want to delete this note?');
        if(!isConfirm) return isConfirm;
        delete objOfNotes[id];
        localStorage.setItem('newArray', JSON.stringify(objOfNotes));
        return isConfirm;
    }

// Create a function which removes note-item from DOM after confirmation
    function deleteNoteFromHtml(confirmed, el) {
        if(!confirmed) return;
        el.remove();
    }

// Create a function which removes chosen note-item from noteField
    function onDeleteHandler({ target }) {
        if(target.classList.contains('delete')) {
            const parent = target.closest('[data-note-id]');
            const id = parent.dataset.noteId;
            const confirmed = deleteNote(id);
            deleteNoteFromHtml(confirmed, parent);
        }
    }

// Create a function which removes note-item from noteField
    function onSaveHandler({ target }) {
        if(target.classList.contains('save')) {
            const parent = target.closest('[data-note-id]');
            const id = parent.dataset.noteId;
            objOfNotes[`${id}`].text = parent.childNodes[0].value;
            localStorage.setItem('newArray', JSON.stringify(objOfNotes));
        }
    }

// Add click event to the button to create new note in DOM
    btnPlus.addEventListener('click', () => {
        const note = drawNote();
        noteField.insertAdjacentElement('beforeend', note);
        let left = note.getBoundingClientRect().x;
        let top = note.getBoundingClientRect().y;
        let _id = note.dataset.noteId;
        createNewNote(note.childNodes[0].value, left, top, note.style.backgroundColor, _id);
    });

// Add click event to Delete-button to delete note
    noteField.addEventListener('click', onDeleteHandler);

// Add click event to Ok-button to save note
    noteField.addEventListener('click', onSaveHandler);

});
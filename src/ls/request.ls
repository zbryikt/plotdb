angular.module \plotDB
  ..controller \plRequest,
    <[$scope]> ++
    ($scope) ->
      editor = new MediumEditor $('#request-editor .editable').0, do
        toolbar: buttons: <[bold italic underline list-extension]>
        extensions: 'list-extension': new MediumEditorList!
        placeholder: text: 'I want to make a chart of ....'
        mediumEditorList: do
          newParagraphTemplate: '<li>...</li>'
          buttonTemplate: '<b>List</b>'
          addParagraphTemplate: 'Add new paragraph'
          isEditable: true
      $('#request-editor .editable').mediumInsert {editor}


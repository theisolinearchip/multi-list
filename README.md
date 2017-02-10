## multi-list

A jQuery plugin to turn an unordered list into a multiple selectable list.

### Starting

You'll need and \<ul> with some entries and a unique **value** for each item:

```markdown
<ul>
  <li value='eur'>Europe</li>
  <li value='oce'>Oceania</li>
  <li value='afr'>Africa</li>
  <li value='asi'>Asia</li>
  <li value='nam'>North Americ</li>
  <li value='sam'>South America</li>
  <li value='mea'>Middle East</li>
</ul>
```

Then, to create the multi-list:

```markdown
$("#list").multiList();
```

Now you're ready!

### Methods

Select or unselect all the elements:

```markdown
$('#list').multiList('selectAll');
$('#list').multiList('unselectAll');
```

Select a single element (using the list *value*):

```markdown
$('#list').multiList('select', 'asi');
```

Hide or show elements from the list. The current selected state for a hidden element doesn't change. Also, the *select* method won't select a hidden element, but a *selectAll* method will do it (same with the *unselect* related methods):

```markdown
$('#list').multiList('hide', 'oce');
$('#list').multiList('show', ['nam', 'sam']); // array of values also accepted
$('#list').multiList('hideAll');
$('#list').multiList('showAll');
```

Disable or enable an element (won't be able to be selected when clicking, but you can still using the *select* methods):

```markdown
$('#list').multiList('disable', 'afr');
$('#list').multiList('enable', 'afr');
```

Change the name for an existing element:

```markdown
$('#list').multiList('setName', 'mea', 'Middle-Earth');
```

Get the selected or unselected elements:

```markdown
var selected_elements = $('#list').multiList('getSelected'); // returns an array of values: ['sam', 'nam', 'asi']
var selected_elements_full = $('#list').multiList('getSelectedFull'); // returns an array of pair values-name: [['sam', 'South America'], ['nam', 'North America'], ['asi','Asia']]
var unselected_elements_full = $('#list').multiList('getUnselectedFull');
```

### Events

The events are triggered when *selecting* or *unselecting* an element:

```markdown
$('#list').on('multiList.elementChecked', function(event, value, text) {
  console.log('Checked the element ' + value + ' with text ' + text);
});

$('#list').on('multiList.elementUnchecked', function(event, value, text) {
  console.log('Unchecked the element ' + value + ' with text ' + text);
});
```

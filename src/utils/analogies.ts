export const getAnalogy = (tab: string, explanation: string): string => {
  const text = explanation.toLowerCase();
  
  if (tab === 'array') {
    if (text.includes('initial')) return "Here is our shelf containing some initial boxes placed side-by-side.";
    if (text.includes('created')) return "We set up a brand new row of lockers.";
    if (text.includes('check index') || text.includes('locate index') || text.includes('identify element')) {
      const idxMatch = explanation.match(/index (\d+)/i);
      const idx = idxMatch ? idxMatch[1] : '0';
      return `Walk to locker number ${idx} to inspect the spot.`;
    }
    if (text.includes('shift elements') || text.includes('shifting')) {
      return "Ask everyone to slide one locker over to make room.";
    }
    if (text.includes('insert element') || text.includes('insert value') || text.includes('insert')) {
      const valMatch = explanation.match(/element (\d+)|value (\d+)/i);
      const val = valMatch ? (valMatch[1] || valMatch[2]) : '';
      return `Place our item ${val} into the empty locker.`;
    }
    if (text.includes('remove') || text.includes('delete')) {
      return "Take the item out of the locker, leaving an empty spot.";
    }
    if (text.includes('update') || text.includes('set')) {
      return "Swap the item inside the locker with our new item.";
    }
    if (text.includes('compare')) {
      return "Compare the item in this box with our search target.";
    }
    if (text.includes('found')) {
      return "Aha! We found the target box successfully!";
    }
  }

  if (tab === 'linked-list') {
    if (text.includes('initial')) return "Here is a series of clue boxes connected by strings.";
    if (text.includes('create a new node') || text.includes('create new node')) {
      return "Create a new clue box and write the value on it.";
    }
    if (text.includes('point the \'next\'') || text.includes('point the next')) {
      return "Tie a string from our new clue box to the first box.";
    }
    if (text.includes('update the head') || text.includes('shift head')) {
      return "Mark this new box as the starting clue of our search.";
    }
    if (text.includes('traversing') || text.includes('traverse')) {
      return "Follow the string connection from the current box to the next box.";
    }
    if (text.includes('point the last') || text.includes('link tail')) {
      return "Tie the string from the last box to our brand new clue box.";
    }
    if (text.includes('reverse')) {
      return "Walk through the path and tie the strings in the exact opposite direction.";
    }
    if (text.includes('remove') || text.includes('delete')) {
      return "Untie this clue box and tie the previous box directly to the next box.";
    }
  }

  if (tab === 'stack') {
    if (text.includes('initial')) return "Here is an empty stack tray ready for dinner plates.";
    if (text.includes('push')) {
      const valMatch = explanation.match(/push (\d+)|value (\d+)/i);
      const val = valMatch ? (valMatch[1] || valMatch[2]) : '';
      return `Place a dinner plate labeled ${val} on top of our stack.`;
    }
    if (text.includes('pop')) {
      return "Lift and remove the top plate from our stack of plates.";
    }
    if (text.includes('peek') || text.includes('top')) {
      return "Look at the top plate on the stack without moving it.";
    }
    if (text.includes('overflow')) {
      return "Oh no! The plate stack is too high and will tip over if we add more.";
    }
    if (text.includes('underflow') || text.includes('empty')) {
      return "The plate stack is empty, there is nothing to remove.";
    }
  }

  if (tab === 'queue') {
    if (text.includes('initial')) return "Here is an empty queue line at the ticket counter.";
    if (text.includes('enqueue') || text.includes('insert') || text.includes('add')) {
      return "A new person joins the back of the movie ticket line.";
    }
    if (text.includes('dequeue') || text.includes('remove') || text.includes('pop')) {
      return "The person at the front of the line buys their ticket and exits.";
    }
    if (text.includes('empty')) {
      return "The ticket line is currently empty.";
    }
    if (text.includes('rear') || text.includes('front')) {
      return "Inspect the start or end of the ticket line.";
    }
  }

  if (tab === 'tree') {
    if (text.includes('initial')) return "Here is our family tree starting with the root ancestor.";
    if (text.includes('insert')) {
      return "Compare our value with the current ancestor node. If smaller, go left; if larger, go right.";
    }
    if (text.includes('search')) {
      return "Inspect the signpost. Go down the left path if our target is smaller, or the right path if larger.";
    }
    if (text.includes('traverse') || text.includes('in-order')) {
      return "Walk around the tree, visiting the left branch, then the trunk, then the right branch.";
    }
    if (text.includes('balance') || text.includes('rotate')) {
      return "The tree is leaning too much to one side! Shift the branches to re-balance it.";
    }
  }

  if (tab === 'heap') {
    if (text.includes('initial')) return "Here is an empty leaderboard tree.";
    if (text.includes('insert')) {
      return "Add a new contestant to the bottom of the tournament ladder.";
    }
    if (text.includes('bubble-up') || text.includes('heapify-up') || text.includes('swap')) {
      return "Let the new contestant swap places with their parent if they have a higher rank.";
    }
    if (text.includes('delete') || text.includes('poll') || text.includes('extract')) {
      return "Remove the winner at the top, and put the lowest-ranked contestant at the top temporarily.";
    }
    if (text.includes('bubble-down') || text.includes('heapify-down')) {
      return "Let the temporary top contestant filter down by swapping with their highest-ranked child.";
    }
  }

  if (tab === 'hash-table') {
    if (text.includes('initial')) return "Here is a row of empty post office mailboxes.";
    if (text.includes('hash') || text.includes('index')) {
      return "Calculate the locker number by looking at the address on the envelope.";
    }
    if (text.includes('insert')) {
      return "Place the letter into the calculated locker.";
    }
    if (text.includes('collision')) {
      return "Oh! That mailbox is already full. Find the next empty mailbox nearby.";
    }
    if (text.includes('search')) {
      return "Look in the designated mailbox index to find our target letter.";
    }
  }

  if (tab === 'graph') {
    if (text.includes('initial')) return "Here is a map of cities connected by highways.";
    if (text.includes('bfs')) {
      return "Explore all neighboring cities first, like ripples expanding in water.";
    }
    if (text.includes('dfs')) {
      return "Explore as deep as possible down a single highway before backtracking.";
    }
    if (text.includes('dijkstra') || text.includes('shortest path')) {
      return "Find the absolute quickest highway route from city to city.";
    }
    if (text.includes('mst') || text.includes('prim') || text.includes('kruskal')) {
      return "Find the cheapest way to connect all cities with roads without loops.";
    }
  }

  if (text.includes('binary search')) {
    return "Open the dictionary in the exact middle. Throw away the half that doesn't contain our word.";
  }
  if (text.includes('bubble sort') || text.includes('bubble')) {
    return "Walk down the line, comparing neighboring heights and swapping them if out of order.";
  }
  if (text.includes('quick sort') || text.includes('pivot')) {
    return "Pick a benchmark person (pivot). Move everyone shorter to their left and taller to their right.";
  }
  if (text.includes('merge sort') || text.includes('divide')) {
    return "Split the class in half repeatedly, sort the small groups, then merge them back in order.";
  }
  if (text.includes('compare')) {
    return "Compare two items side-by-side to see which is larger.";
  }

  // Fallback to technical text
  return explanation;
};

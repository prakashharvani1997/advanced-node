
const puppeteer = require('puppeteer')
// jest.setTimeout(1000 * 60 * 10);
 
test('Add a numbers.', () => {

    const sum = 1+2;

    expect(sum).toEqual(3);
})

test('We can launch a browser.',async ()=>{

})

// afterEach(() => { 
//     jest.clearAllMocks(); 
//     jest.resetAllMocks();
//   });
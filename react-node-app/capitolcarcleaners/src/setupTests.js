import Enzyme from 'enzyme';
var Adapter = require('enzyme-adapter-react-16');

Enzyme.configure({ adapter: new Adapter() });
const { User } = require('../../src/models');
const bcrypt = require('bcryptjs');
const truncate = require('../utils/truncate');

describe('User', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('should encrypt password', async () => {
    const user = await User.create({
      name: 'Igor',
      email: 'igor@gmail.com',
      password: '123'
    });

    const hashCompare = await bcrypt.compare('123', user.password_hash);

    expect(hashCompare).toBe(true);
  });
});

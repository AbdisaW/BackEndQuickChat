module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('users', 'profilePicture', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('users', 'profilePicture', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },
};

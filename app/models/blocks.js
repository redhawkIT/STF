module.exports = function(sequelize, DataTypes) {

	var Block = sequelize.define('Block', {
		Name: 'VARCHAR(100)',
		Status: 'MEDIUMINT',
		ProposerId: 'MEDIUMINT',
		ProposedAbstract: DataTypes.TEXT,
		PrimaryNetId: DataTypes.STRING,
		PrimaryName: DataTypes.STRING,
		PrimaryTitle: DataTypes.STRING,
		PrimaryPhone: DataTypes.STRING,
		PrimaryMail: DataTypes.STRING,
		PrimarySignature: 'TINYINT',
		BudgetNetId: DataTypes.STRING,
		BudgetName: DataTypes.STRING,
		BudgetTitle: DataTypes.STRING,
		BudgetPhone: DataTypes.STRING,
		BudgetMail: DataTypes.STRING,
		BudgetSignature: 'TINYINT',
		HeadNetId: DataTypes.STRING,
		HeadName: DataTypes.STRING,
		HeadTitle: DataTypes.STRING,
		HeadPhone: DataTypes.STRING,
		HeadMail: DataTypes.STRING,
		HeadSignature: 'TINYINT',
		VisionStatement: DataTypes.TEXT,
		History: DataTypes.TEXT,
		Structure: DataTypes.TEXT,
		Estimate: 'BIGINT',
		Budget: DataTypes.TEXT,
		Service: DataTypes.TEXT,
		Turnover: DataTypes.TEXT,
		Goals: DataTypes.TEXT,
		Included: DataTypes.TEXT,
		Administration: DataTypes.TEXT,
		PlanB: DataTypes.TEXT,
		OtherSources: DataTypes.TEXT,
		Background: 'VARCHAR(100)'


	}, {
		paranoid: true
	});
	
	return Block;
}
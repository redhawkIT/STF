module.exports = function(sequelize, DataTypes) {

	var Vote = sequelize.define('Vote', {
		ProposalId: 'INT',
		SupplementalId: 'INT',
		BlockId: 'MEDIUMINT',
		ProjectId: 'MEDIUMINT',
		VoterId: 'MEDIUMINT',
		Value: 'MEDIUMINT'
	});
	
	return Vote;
}
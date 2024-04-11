package br.com.unochapeco.model.dao;

import br.com.unochapeco.model.impl.PaisDaoJDBC;
import br.com.unochapeco.relpi.controller.db.DB;

public class DaoFactory {

	public static PaisDao createPaisDao() {
		return new PaisDaoJDBC(DB.getConnection());
	}
}
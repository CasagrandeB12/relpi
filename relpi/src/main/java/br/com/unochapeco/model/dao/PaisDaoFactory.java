package br.com.unochapeco.model.dao;

import br.com.unochapeco.model.services.PaisJDBC;
import br.com.unochapeco.relpi.controller.db.DB;

public class PaisDaoFactory {

	public static PaisDao createPaisDao(){
		return new PaisJDBC(DB.getConnection());
	}
}

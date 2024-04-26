package br.com.unochapeco.model.dao;

import br.com.unochapeco.relpi.controller.db.DB;
import br.com.unochapeco.relpi.resources.ProfissionalJDBC;

public class ProfissionalDaoFactory {

	public static ProfissionalDao createProfissionalDao () {
		return new ProfissionalJDBC (DB.getConnection());
	}
}

package br.com.unochapeco.model.dao;

import br.com.unochapeco.relpi.controller.db.DB;
import br.com.unochapeco.relpi.resources.ServicoJDBC;

public class ServicoDaoFactory {

	public static ServicoDao createServicoDao() {
		return new ServicoJDBC(DB.getConnection());
	}
}
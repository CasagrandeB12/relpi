package br.com.unochapeco.model.dao;

import br.com.unochapeco.relpi.controller.db.DB;
import br.com.unochapeco.relpi.resources.TipoServicoJDBC;

public class TipoServicoDaoFactory {

	public static TipoServicoDao createTipoServicoDao() {
		return new TipoServicoJDBC(DB.getConnection());
	}
}
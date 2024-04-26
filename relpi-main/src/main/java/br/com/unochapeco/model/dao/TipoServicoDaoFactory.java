package br.com.unochapeco.model.dao;

import br.com.unochapeco.model.services.TipoServicoJDBC;
import br.com.unochapeco.relpi.controller.db.DB;

public class TipoServicoDaoFactory {

	public static TipoServicoDao createTipoServicoDao() {
		return new TipoServicoJDBC(DB.getConnection());
	}
}
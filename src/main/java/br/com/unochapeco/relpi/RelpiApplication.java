package br.com.unochapeco.relpi;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import br.com.unochapeco.model.dao.TipoServicoDaoFactory;
import br.com.unochapeco.model.dao.TipoServicoDao;
import br.com.unochapeco.model.entities.TipoServico;
import br.com.unochapeco.relpi.controller.db.DB;

@SpringBootApplication
public class RelpiApplication {

	public static void main(String[] args) throws SQLException {
		SpringApplication.run(RelpiApplication.class, args);
		Connection conn = DB.getConnection();
		
//		Scanner sc = new Scanner(System.in);
		
		TipoServicoDao tipoServicoDao = TipoServicoDaoFactory.createTipoServicoDao();
		
//		TipoServico newTipoServico = new TipoServico(2, "Cuidados Gerais");
//		tipoServicoDao.insert(newTipoServico);
//		System.out.println("Inserido. Novo id = " + newTipoServico.getId());
//		
//		newPais = paisDao.findById(1);
//		newPais.setNome("Uruguai");
//		paisDao.update(newPais);
		
//		System.out.println("Informe um id para teste de deleção");
//		tipoServicoDao.deleteById(8);
		
		List<TipoServico> list = new ArrayList<>();
		list = tipoServicoDao.findAll();
		for(TipoServico tipoServico : list) {
			System.out.println(tipoServico);
		}
		//DB.closeConnection();
	}
}
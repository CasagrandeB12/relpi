package br.com.unochapeco.relpi;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import br.com.unochapeco.model.dao.DaoFactory;
import br.com.unochapeco.model.dao.PaisDao;
import br.com.unochapeco.model.entities.Pais;
import br.com.unochapeco.relpi.controller.db.DB;

@SpringBootApplication
public class RelpiApplication {

	public static void main(String[] args) throws SQLException {
		SpringApplication.run(RelpiApplication.class, args);
		Connection conn = DB.getConnection();
		
//		Scanner sc = new Scanner(System.in);
		
		PaisDao paisDao = DaoFactory.createPaisDao();
		
		Pais newPais = new Pais(8, "Portugals");
		paisDao.insert(newPais);
		System.out.println("Inserido. Novo id = " + newPais.getId());
//		
//		newPais = paisDao.findById(1);
//		newPais.setNome("Uruguai");
//		paisDao.update(newPais);
		
		System.out.println("Informe um id para teste de deleção");
		paisDao.deleteById(2);
		
		List<Pais> list = new ArrayList<>();
		list = paisDao.findAll();
		for(Pais pais : list) {
			System.out.println(pais);
		}
		//DB.closeConnection();
	}
}
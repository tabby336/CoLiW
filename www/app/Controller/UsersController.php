<?php
/**
 * Static content controller.
 *
 * This file will render views from views/pages/
 *
 * CakePHP(tm) : Rapid Development Framework (http://cakephp.org)
 * Copyright (c) Cake Software Foundation, Inc. (http://cakefoundation.org)
 *
 * Licensed under The MIT License
 * For full copyright and license information, please see the LICENSE.txt
 * Redistributions of files must retain the above copyright notice.
 *
 * @copyright     Copyright (c) Cake Software Foundation, Inc. (http://cakefoundation.org)
 * @link          http://cakephp.org CakePHP(tm) Project
 * @package       app.Controller
 * @since         CakePHP(tm) v 0.2.9
 * @license       http://www.opensource.org/licenses/mit-license.php MIT License
 */

App::uses('AppController', 'Controller');
require_once '/vendor/autoload.php';

use OAuth_io\OAuth;
class UsersController extends AppController {

	public $uses = array('User');

	public function index() {
		/*$results = $this->User->query("SELECT * FROM users");
		//SELECT all/first
		$users = $this->User->find('all',array('conditions'=>array('email'=>'blabla')));
		//$users[0]['User']['email'];
		var_dump($results);*/

		$oauth = new OAuth();
		$oauth->initialize('PZs45acODMBvV6W7BZGR4Lu_4gM', 'nN_dg-16ggVkuSqc38sg_FBwpMs');
		$oauth->redirect('facebook', '/users/callback');
 	}

	public function callback() {
		$this->layout="ajax";
		$this->view='ajax';
		$oauth = new OAuth();
		$oauth->initialize('PZs45acODMBvV6W7BZGR4Lu_4gM', 'nN_dg-16ggVkuSqc38sg_FBwpMs');

		$facebook_requester = $oauth->auth('facebook', array(
		    'redirect' => true
		));

		$result = $facebook_requester->me(array('firstname', 'lastname', 'email'));
		var_dump($result);
	}

	public function test() {
		$this->layout="ajax";
		$this->view='ajax';
		$oauth = new OAuth();
		$oauth->initialize('PZs45acODMBvV6W7BZGR4Lu_4gM', 'nN_dg-16ggVkuSqc38sg_FBwpMs');

		var_dump($_SESSION['oauthio']['auth']['facebook']);
	}

	public function command() {
		$this->layout="ajax";
		$this->view='ajax';
		echo $_POST['command'].'sss';
	}
}

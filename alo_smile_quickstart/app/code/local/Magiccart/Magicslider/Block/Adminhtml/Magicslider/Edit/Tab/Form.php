<?php
/**
 * Magiccart 
 * @category  Magiccart 
 * @copyright   Copyright (c) 2014 Magiccart (http://www.magiccart.net/) 
 * @license   http://www.magiccart.net/license-agreement.html
 * @Author: DOng NGuyen<nguyen@dvn.com>
 * @@Create Date: 2014-09-10 10:21:05
 * @@Modify Date: 2014-11-25 16:03:37
 * @@Function:
 */
?>
<?php
class Magiccart_Magicslider_Block_Adminhtml_Magicslider_Edit_Tab_Form extends Mage_Adminhtml_Block_Widget_Form
{
	protected function _prepareForm()
	{
		$model = Mage::registry('magicslider_data');	
		
		if($model->getStores())
		{		
			//$_model->setPageId(Mage::helper('core')->jsonDecode($_model->getPageId()));
			$model->setStores(explode(',',$model->getStores()));
		}
		$form = new Varien_Data_Form();
		$this->setForm($form);
		$fieldset = $form->addFieldset('magicslider_form', array('legend'=>Mage::helper('magicslider')->__('General Information')));
		
		$fieldset->addField('title', 'text', array(
			'label'     => Mage::helper('magicslider')->__('Title'),
			'class'     => 'required-entry',
			'required'  => true,
			'name'      => 'title',
		));
		
		// if (!Mage::app()->isSingleStoreMode()) {
		// 	$field = $fieldset->addField('stores', 'multiselect', array(
		// 		'name'      => 'stores[]',
		// 		'label'     => Mage::helper('cms')->__('Store View'),
		// 		'title'     => Mage::helper('cms')->__('Store View'),
		// 		'required'  => true,			
		// 		'values'    => Mage::getSingleton('adminhtml/system_store')->getStoreValuesForForm(false, true),
		// 		 'value'     => $model->getStores()
		// 		//'value'     => array('0'=>'1','1'=>'2'),	
		// 	));
		// 	$renderer = $this->getLayout()->createBlock('adminhtml/store_switcher_form_renderer_fieldset_element');
		// 	$field->setRenderer($renderer);
		// }else {
		// 	$fieldset->addField('stores', 'hidden', array(
		// 		'name'      => 'stores[]',
		// 		'value'     => Mage::app()->getStore(true)->getId()
		// 	));
		// 	$model->setStoreId(Mage::app()->getStore(true)->getId());
		// } 
		
		$fieldset->addField('status', 'select', array(
			'label'     => Mage::helper('magicslider')->__('Status'),
			'name'      => 'status',
			'values'    => array(
				array(
				'value'     => 1,
				'label'     => Mage::helper('magicslider')->__('Enabled'),
				),
				array(
				'value'     => 2,
				'label'     => Mage::helper('magicslider')->__('Disabled'),
				),
			),
		));
		
		// $fieldset->addField('advanced_settings', 'textarea', array(
		// 	'label'     => Mage::helper('magicslider')->__('Advanced Settings'),
		// 	'required'  => false,
		// 	'name'      => 'advanced_settings',
		// 	'note'   	=> "Default : {numbers_align: 'right',animation:'fade',interval: 1000,dots: true,navigation: false}"
		// )); 
		
		if (Mage::getSingleton('adminhtml/session')->getMagicsliderData())
		{
			$form->setValues(Mage::getSingleton('adminhtml/session')->getMagicsliderData());
			Mage::getSingleton('adminhtml/session')->setMagicsliderData(null);
		} elseif ( Mage::registry('magicslider_data') ) {
			$form->setValues(Mage::registry('magicslider_data')->getData());
		}
		return parent::_prepareForm();
	}
}

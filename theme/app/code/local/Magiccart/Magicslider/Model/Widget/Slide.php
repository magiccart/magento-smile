<?php
/**
 * Magiccart 
 * @category  Magiccart 
 * @copyright   Copyright (c) 2014 Magiccart (http://www.magiccart.net/) 
 * @license   http://www.magiccart.net/license-agreement.html
 * @Author: DOng NGuyen<nguyen@dvn.com>
 * @@Create Date: 2014-09-10 10:21:05
 * @@Modify Date: 2014-10-07 08:16:11
 * @@Function:
 */
?>
<?php
class Magiccart_Magicslider_Model_Widget_Slide extends Varien_Object
{
	const STATUS_ENABLED = 1;
    public function toOptionArray()
	{
		$collection = Mage::getModel('magicslider/magicslider')->getCollection()->addFilter('status', self::STATUS_ENABLED);		
		$option_array = array ();
		foreach ($collection as $magicslider)
			$option_array[] = array(
				'value' => $magicslider->getSlideId(),
				'label' => $magicslider->getTitle()
			);
		return $option_array;
	}
}
